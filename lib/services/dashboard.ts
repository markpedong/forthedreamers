import 'server-only';

import { cache } from 'react';
import { ORDER_STATUS, Prisma, PRODUCT_STATUS, USER_ROLE } from '@/generated/prisma';
import type {
  AdminDashboardData,
  DashboardPoint,
  DashboardRange,
  SellerDashboardData,
} from '@/app/(admin)/dashboard/types';
import { DASHBOARD_RANGES, LOW_STOCK_THRESHOLD } from '@/app/(admin)/dashboard/types';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

type DashboardBucket = 'day' | 'month';

type RevenueRow = {
  bucket: Date;
  revenue: number | null;
  orders: number | bigint;
};

type ProductMetricRow = {
  id: string;
  name: string;
  images: string[] | null;
  unitsSold: number | bigint;
  revenue: number | null;
  stock: number | null;
  status: string;
};

type SellerMetricRow = {
  id: string;
  storeName: string;
  unitsSold: number | bigint;
  revenue: number | null;
  orders: number | bigint;
  activeProducts: number | bigint;
};

const QUALIFYING_ORDER_STATUSES = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.COMPLETED,
] as const;

// Checkout stores finalPriceAfterDiscount as the LINE total (quantity already included).
// Revenue uses order creation cohorts in UTC, not payment-date cash flow: no paidAt exists.
// Require payment confirmation as well as a paid/fulfilled order status. Legacy ungrouped
// orders cannot prove payment and are excluded. Exclude refunded orders/payment groups and
// orders with completed refunds; partial refunds lack a reliable seller-level settlement ledger.
const revenueWhere: Prisma.OrderWhereInput = {
  status: { in: [...QUALIFYING_ORDER_STATUSES] },
  orderGroup: { is: { paymentStatus: 'PAID' } },
  returnRequests: { none: { status: 'COMPLETED', refundAmount: { gt: 0 } } },
};
const revenueSql = Prisma.sql`
  o.status::text IN (${Prisma.join(QUALIFYING_ORDER_STATUSES)})
  AND EXISTS (SELECT 1 FROM "order_group" g WHERE g.id = o."orderGroupId" AND g."paymentStatus" = 'PAID')
  AND NOT EXISTS (SELECT 1 FROM "return_request" r WHERE r."orderId" = o.id AND r.status = 'COMPLETED' AND r."refundAmount" > 0)
`;
const sellerItems = (sellerId: string): Prisma.OrderItemWhereInput => ({
  variant: { product: { sellerId } },
});

const normalizeCount = (value: number | bigint | null | undefined) => Number(value ?? 0);

const normalizeDashboardRange = (value?: string): DashboardRange =>
  DASHBOARD_RANGES.find(range => range === value) ?? '30d';

export const getDashboardRange = normalizeDashboardRange;

const getRangeBounds = cache((range: DashboardRange) => {
  const end = new Date();
  const start = new Date(end);

  if (range === '12m') {
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCMonth(start.getUTCMonth() - 11);
  } else {
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - (range === '7d' ? 6 : 29));
  }

  return { start, end, bucket: range === '12m' ? ('month' as const) : ('day' as const) };
});

const bucketKey = (date: Date, bucket: DashboardBucket) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  if (bucket === 'month') return `${year}-${month}`;

  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fillRevenueSeries = (rows: RevenueRow[], start: Date, end: Date, bucket: DashboardBucket): DashboardPoint[] => {
  const values = new Map(
    rows.map(row => {
      const date = new Date(row.bucket);
      return [bucketKey(date, bucket), { revenue: Number(row.revenue ?? 0), orders: normalizeCount(row.orders) }];
    })
  );
  const points: DashboardPoint[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const key = bucketKey(cursor, bucket);
    const value = values.get(key) ?? { revenue: 0, orders: 0 };
    points.push({ date: cursor.toISOString(), ...value });
    if (bucket === 'month') cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    else cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return points;
};

const getRevenueRows = async (range: DashboardRange, sellerId?: string) => {
  const { start, end, bucket } = getRangeBounds(range);
  const bucketName = bucket === 'month' ? 'month' : 'day';

  const rows = sellerId
    ? await prisma.$queryRaw<RevenueRow[]>(Prisma.sql`
        SELECT date_trunc(${bucketName}, o."createdAt") AS bucket,
               COALESCE(SUM(oi."finalPriceAfterDiscount"), 0)::double precision AS revenue,
               COUNT(DISTINCT o.id)::int AS orders
        FROM "order_item" oi
        INNER JOIN "order" o ON o.id = oi."orderId"
        INNER JOIN "variant" purchased ON purchased.id = oi."variantId"
    INNER JOIN "product" p ON p.id = purchased."productId"
        WHERE ${revenueSql}
          AND o."createdAt" >= ${start}
          AND o."createdAt" < ${end}
          AND p."sellerId" = ${sellerId}
        GROUP BY bucket
        ORDER BY bucket ASC
      `)
    : await prisma.$queryRaw<RevenueRow[]>(Prisma.sql`
        SELECT date_trunc(${bucketName}, o."createdAt") AS bucket,
               COALESCE(SUM(o.total), 0)::double precision AS revenue,
               COUNT(o.id)::int AS orders
        FROM "order" o
        WHERE ${revenueSql}
          AND o."createdAt" >= ${start}
          AND o."createdAt" < ${end}
        GROUP BY bucket
        ORDER BY bucket ASC
      `);

  return fillRevenueSeries(rows, start, end, bucket);
};

const getTopProducts = async (range: DashboardRange, sellerId?: string) => {
  const { start, end } = getRangeBounds(range);
  const sellerFilter = sellerId ? Prisma.sql`AND p."sellerId" = ${sellerId}` : Prisma.sql``;
  const rows = await prisma.$queryRaw<ProductMetricRow[]>(Prisma.sql`
    SELECT p.id,
           p.name,
           p.images,
           COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
           COALESCE(SUM(oi."finalPriceAfterDiscount"), 0)::double precision AS revenue,
           COALESCE((SELECT SUM(v.stock) FROM "variant" v WHERE v."productId" = p.id), 0)::int AS stock,
           p.status
    FROM "order_item" oi
    INNER JOIN "order" o ON o.id = oi."orderId"
    INNER JOIN "variant" purchased ON purchased.id = oi."variantId"
    INNER JOIN "product" p ON p.id = purchased."productId"
    WHERE ${revenueSql}
      AND o."createdAt" >= ${start}
      AND o."createdAt" < ${end}
      ${sellerFilter}
    GROUP BY p.id
    ORDER BY revenue DESC, "unitsSold" DESC, p.name ASC
    LIMIT 5
  `);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    image: row.images?.[0] ?? null,
    unitsSold: normalizeCount(row.unitsSold),
    revenue: Number(row.revenue ?? 0),
    stock: normalizeCount(row.stock),
    status: row.status as PRODUCT_STATUS,
  }));
};

const getSellerInventory = async (sellerId: string) => {
  const stock = Prisma.sql`COALESCE((SELECT SUM(v.stock) FROM "variant" v WHERE v."productId" = p.id), 0)::int`;
  const [summary, attention] = await Promise.all([
    prisma.$queryRaw<Array<{ products: number; active: number; inactive: number; outOfStock: number }>>(Prisma.sql`
      SELECT COUNT(*)::int AS products,
        COUNT(*) FILTER (WHERE p.status = 'ACTIVE')::int AS active,
        COUNT(*) FILTER (WHERE p.status = 'INACTIVE')::int AS inactive,
        COUNT(*) FILTER (WHERE ${stock} = 0)::int AS "outOfStock"
      FROM "product" p WHERE p."sellerId" = ${sellerId}
    `),
    prisma.$queryRaw<
      Array<{ id: string; name: string; image: string | null; stock: number; status: PRODUCT_STATUS }>
    >(Prisma.sql`
      SELECT p.id, p.name, p.images[1] AS image, ${stock} AS stock, p.status
      FROM "product" p WHERE p."sellerId" = ${sellerId} AND p.status = 'ACTIVE'
        AND ${stock} <= ${LOW_STOCK_THRESHOLD}
      ORDER BY stock ASC, p.name ASC, p.id ASC LIMIT 5
    `),
  ]);
  return { summary: summary[0], attention };
};

const getSellerRecentOrders = async (sellerId: string, range: DashboardRange) => {
  const { start, end } = getRangeBounds(range);
  const where: Prisma.OrderWhereInput = {
    createdAt: { gte: start, lt: end },
    orderItems: { some: sellerItems(sellerId) },
  };
  const orders = await prisma.order.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: 6,
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      sellerId: true,
      user: { select: { name: true } },
      orderItems: {
        where: sellerItems(sellerId),
        select: { quantity: true, finalPriceAfterDiscount: true },
      },
    },
  });

  return orders.map(order => ({
    id: order.id,
    customer: order.user.name || 'Customer',
    itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    amount: order.orderItems.reduce((sum, item) => sum + item.finalPriceAfterDiscount, 0),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }));
};

const getAdminRecentOrders = async (range: DashboardRange) => {
  const { start, end } = getRangeBounds(range);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start, lt: end } },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: 6,
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      user: { select: { name: true } },
      orderItems: { select: { quantity: true } },
    },
  });

  return orders.map(order => ({
    id: order.id,
    customer: order.user.name || 'Customer',
    itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    amount: order.total,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }));
};

const getTopSellers = async (range: DashboardRange) => {
  const { start, end } = getRangeBounds(range);
  const rows = await prisma.$queryRaw<SellerMetricRow[]>(Prisma.sql`
    SELECT s.id,
           s."storeName",
           COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
           COALESCE(SUM(oi."finalPriceAfterDiscount"), 0)::double precision AS revenue,
           COUNT(DISTINCT o.id)::int AS orders,
           (SELECT COUNT(*)::int FROM "product" catalog WHERE catalog."sellerId" = s.id AND catalog.status = 'ACTIVE') AS "activeProducts"
    FROM "order_item" oi
    INNER JOIN "order" o ON o.id = oi."orderId"
    INNER JOIN "variant" purchased ON purchased.id = oi."variantId"
    INNER JOIN "product" p ON p.id = purchased."productId"
    INNER JOIN "seller" s ON s.id = p."sellerId"
    WHERE ${revenueSql}
      AND o."createdAt" >= ${start}
      AND o."createdAt" < ${end}
    GROUP BY s.id
    ORDER BY revenue DESC, "unitsSold" DESC, s."storeName" ASC
    LIMIT 5
  `);

  return rows.map(row => ({
    id: row.id,
    storeName: row.storeName,
    unitsSold: normalizeCount(row.unitsSold),
    revenue: Number(row.revenue ?? 0),
    orders: normalizeCount(row.orders),
    activeProducts: normalizeCount(row.activeProducts),
  }));
};

const requireSeller = async () => {
  const user = await getSessionUser();
  if (!user || !user.emailVerified || user.banned || user.role !== USER_ROLE.SELLER)
    throw new Error('Seller dashboard access required');

  const seller = await prisma.seller.findUnique({ where: { userId: user.id }, select: { id: true, storeName: true } });
  if (!seller) throw new Error('Seller profile not found');
  return seller;
};

export const getSellerDashboardData = async (range: DashboardRange): Promise<SellerDashboardData> => {
  const seller = await requireSeller();
  const normalizedRange = normalizeDashboardRange(range);
  const { start, end } = getRangeBounds(normalizedRange);
  const orderItemWhere: Prisma.OrderItemWhereInput = {
    order: { ...revenueWhere, createdAt: { gte: start, lt: end } },
    ...sellerItems(seller.id),
  };
  const orderWhere: Prisma.OrderWhereInput = {
    createdAt: { gte: start, lt: end },
    ...revenueWhere,
    orderItems: { some: sellerItems(seller.id) },
  };

  const [inventory, revenue, orders, review, revenueSeries, recentOrders, topProducts] = await Promise.all([
    getSellerInventory(seller.id),
    prisma.orderItem.aggregate({ where: orderItemWhere, _sum: { finalPriceAfterDiscount: true, quantity: true } }),
    prisma.order.count({ where: orderWhere }),
    prisma.review.aggregate({
      where: { product: { sellerId: seller.id }, isPublished: true },
      _avg: { rating: true },
      _count: { id: true },
    }),
    getRevenueRows(normalizedRange, seller.id),
    getSellerRecentOrders(seller.id, normalizedRange),
    getTopProducts(normalizedRange, seller.id),
  ]);
  const revenueTotal = Number(revenue._sum.finalPriceAfterDiscount ?? 0);
  const orderTotal = orders;

  return {
    role: 'SELLER',
    range: normalizedRange,
    storeName: seller.storeName,
    revenueSeries,
    summary: {
      revenue: revenueTotal,
      orders: orderTotal,
      products: inventory.summary.products,
      unitsSold: normalizeCount(revenue._sum.quantity),
      averageOrderValue: orderTotal ? revenueTotal / orderTotal : 0,
      rating: review._avg.rating ?? null,
      reviewCount: review._count.id,
    },
    productStatus: {
      active: inventory.summary.active,
      inactive: inventory.summary.inactive,
      outOfStock: inventory.summary.outOfStock,
    },
    recentOrders,
    topProducts,
    inventoryAttention: inventory.attention,
  };
};

export const getAdminDashboardData = async (range: DashboardRange): Promise<AdminDashboardData> => {
  const user = await getSessionUser();
  if (!user || !user.emailVerified || user.banned || user.role !== USER_ROLE.ADMIN)
    throw new Error('Administrator dashboard access required');

  const normalizedRange = normalizeDashboardRange(range);
  const { start, end } = getRangeBounds(normalizedRange);
  const orderWhere: Prisma.OrderWhereInput = {
    createdAt: { gte: start, lt: end },
    ...revenueWhere,
  };

  const [
    revenue,
    orders,
    customers,
    sellers,
    products,
    activeProducts,
    pendingOrders,
    orderStatuses,
    revenueSeries,
    recentOrders,
    topSellers,
    topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({ where: orderWhere, _sum: { total: true } }),
    prisma.order.count({ where: orderWhere }),
    prisma.user.count({ where: { role: USER_ROLE.USER } }),
    prisma.seller.count(),
    prisma.product.count(),
    prisma.product.count({ where: { status: PRODUCT_STATUS.ACTIVE } }),
    prisma.order.count({ where: { status: ORDER_STATUS.PENDING } }),
    prisma.order.groupBy({ where: { createdAt: { gte: start, lt: end } }, by: ['status'], _count: { id: true } }),
    getRevenueRows(normalizedRange),
    getAdminRecentOrders(normalizedRange),
    getTopSellers(normalizedRange),
    getTopProducts(normalizedRange),
  ]);
  const revenueTotal = Number(revenue._sum.total ?? 0);

  return {
    role: 'ADMIN',
    range: normalizedRange,
    revenueSeries,
    summary: {
      revenue: revenueTotal,
      orders,
      customers,
      sellers,
      products,
      activeProducts,
      averageOrderValue: orders ? revenueTotal / orders : 0,
      pendingOrders,
    },
    orderStatuses: orderStatuses.map(item => ({ status: item.status, count: item._count.id })),
    recentOrders,
    topSellers,
    topProducts,
  };
};
