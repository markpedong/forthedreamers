import 'server-only'

import {ORDER_STATUS, Prisma, PRODUCT_STATUS, USER_ROLE} from '@/generated/prisma'
import type {AdminDashboardData, DashboardPoint, DashboardRange, SellerDashboardData} from '@/app/(admin)/dashboard/types'
import {DASHBOARD_RANGES, LOW_STOCK_THRESHOLD} from '@/app/(admin)/dashboard/types'
import prisma from '@/lib/prisma'
import {getSession} from '@/lib/server-actions'

type DashboardBucket = 'day' | 'month'

type RevenueRow = {
  bucket: Date
  revenue: number | null
  orders: number | bigint
}

type ProductMetricRow = {
  id: string
  name: string
  images: string[] | null
  unitsSold: number | bigint
  revenue: number | null
  stock: number | null
  status: string
}

type SellerMetricRow = {
  id: string
  storeName: string
  unitsSold: number | bigint
  revenue: number | null
  orders: number | bigint
  activeProducts: number | bigint
}

const QUALIFYING_ORDER_STATUSES = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.COMPLETED
] as const

const normalizeCount = (value: number | bigint | null | undefined) => Number(value ?? 0)

const normalizeDashboardRange = (value?: string): DashboardRange => {
  return DASHBOARD_RANGES.includes(value as DashboardRange) ? (value as DashboardRange) : '30d'
}

export const getDashboardRange = normalizeDashboardRange

const getRangeBounds = (range: DashboardRange) => {
  const end = new Date()
  const start = new Date(end)

  if (range === '12m') {
    start.setUTCDate(1)
    start.setUTCHours(0, 0, 0, 0)
    start.setUTCMonth(start.getUTCMonth() - 11)
  } else {
    start.setUTCHours(0, 0, 0, 0)
    start.setUTCDate(start.getUTCDate() - (range === '7d' ? 6 : 29))
  }

  return {start, end, bucket: range === '12m' ? 'month' as const : 'day' as const}
}

const bucketKey = (date: Date, bucket: DashboardBucket) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  if (bucket === 'month') return `${year}-${month}`

  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fillRevenueSeries = (rows: RevenueRow[], start: Date, end: Date, bucket: DashboardBucket): DashboardPoint[] => {
  const values = new Map(rows.map(row => {
    const date = new Date(row.bucket)
    return [bucketKey(date, bucket), {revenue: Number(row.revenue ?? 0), orders: normalizeCount(row.orders)}]
  }))
  const points: DashboardPoint[] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    const key = bucketKey(cursor, bucket)
    const value = values.get(key) ?? {revenue: 0, orders: 0}
    points.push({date: cursor.toISOString(), ...value})
    if (bucket === 'month') cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    else cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return points
}

const getRevenueRows = async (range: DashboardRange, sellerId?: string) => {
  const {start, end, bucket} = getRangeBounds(range)
  const bucketName = bucket === 'month' ? 'month' : 'day'
  const statuses = Prisma.join(QUALIFYING_ORDER_STATUSES)

  const rows = sellerId
    ? await prisma.$queryRaw<RevenueRow[]>(Prisma.sql`
        SELECT date_trunc(${bucketName}, o."createdAt") AS bucket,
               COALESCE(SUM(oi."finalPriceAfterDiscount"), 0)::double precision AS revenue,
               COUNT(DISTINCT o.id)::int AS orders
        FROM "order_item" oi
        INNER JOIN "order" o ON o.id = oi."orderId"
        INNER JOIN "product" p ON p.id = oi."productId"
        WHERE o.status IN (${statuses})
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
        WHERE o.status IN (${statuses})
          AND o."createdAt" >= ${start}
          AND o."createdAt" < ${end}
        GROUP BY bucket
        ORDER BY bucket ASC
      `)

  return fillRevenueSeries(rows, start, end, bucket)
}

const getTopProducts = async (range: DashboardRange, sellerId?: string) => {
  const {start, end} = getRangeBounds(range)
  const statuses = Prisma.join(QUALIFYING_ORDER_STATUSES)
  const sellerFilter = sellerId ? Prisma.sql`AND p."sellerId" = ${sellerId}` : Prisma.sql``
  const rows = await prisma.$queryRaw<ProductMetricRow[]>(Prisma.sql`
    SELECT p.id,
           p.name,
           p.images,
           COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
           COALESCE(SUM(oi."finalPriceAfterDiscount"), 0)::double precision AS revenue,
           COALESCE((SELECT SUM(v.stock) FROM "variant" v WHERE v."productId" = p.id), p.stock, 0)::int AS stock,
           p.status
    FROM "order_item" oi
    INNER JOIN "order" o ON o.id = oi."orderId"
    INNER JOIN "product" p ON p.id = oi."productId"
    WHERE o.status IN (${statuses})
      AND o."createdAt" >= ${start}
      AND o."createdAt" < ${end}
      ${sellerFilter}
    GROUP BY p.id
    ORDER BY revenue DESC, "unitsSold" DESC, p.name ASC
    LIMIT 5
  `)

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    image: row.images?.[0] ?? null,
    unitsSold: normalizeCount(row.unitsSold),
    revenue: Number(row.revenue ?? 0),
    stock: normalizeCount(row.stock),
    status: row.status as PRODUCT_STATUS
  }))
}

const getSellerInventory = async (sellerId: string) => {
  const products = await prisma.product.findMany({
    where: {sellerId},
    select: {
      id: true,
      name: true,
      images: true,
      status: true,
      stock: true,
      variants: {select: {stock: true}}
    }
  })
  const rows = products.map(product => ({
    id: product.id,
    name: product.name,
    image: product.images[0] ?? null,
    status: product.status,
    stock: product.variants.length ? product.variants.reduce((sum, variant) => sum + variant.stock, 0) : product.stock ?? 0
  }))

  return {
    rows,
    summary: {
      products: rows.length,
      active: rows.filter(product => product.status === PRODUCT_STATUS.ACTIVE).length,
      inactive: rows.filter(product => product.status === PRODUCT_STATUS.INACTIVE).length,
      outOfStock: rows.filter(product => product.stock === 0).length
    },
    attention: rows
      .filter(product => product.status === PRODUCT_STATUS.ACTIVE && product.stock <= LOW_STOCK_THRESHOLD)
      .sort((left, right) => left.stock - right.stock || left.name.localeCompare(right.name))
      .slice(0, 5)
  }
}

const getSellerRecentOrders = async (sellerId: string, range: DashboardRange) => {
  const {start, end} = getRangeBounds(range)
  const where: Prisma.OrderWhereInput = {
    createdAt: {gte: start, lt: end},
    OR: [
      {sellerId},
      {orderItems: {some: {product: {sellerId}}}}
    ]
  }
  const orders = await prisma.order.findMany({
    where,
    orderBy: [{createdAt: 'desc'}, {id: 'desc'}],
    take: 6,
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      sellerId: true,
      user: {select: {name: true}},
      orderItems: {
        where: {product: {sellerId}},
        select: {quantity: true, finalPriceAfterDiscount: true}
      }
    }
  })

  return orders.map(order => ({
    id: order.id,
    customer: order.user.name || 'Customer',
    itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    amount: order.orderItems.length
      ? order.orderItems.reduce((sum, item) => sum + item.finalPriceAfterDiscount, 0)
      : order.sellerId === sellerId
        ? order.total
        : 0,
    status: order.status,
    createdAt: order.createdAt.toISOString()
  }))
}

const getAdminRecentOrders = async (range: DashboardRange) => {
  const {start, end} = getRangeBounds(range)
  const orders = await prisma.order.findMany({
    where: {createdAt: {gte: start, lt: end}},
    orderBy: [{createdAt: 'desc'}, {id: 'desc'}],
    take: 6,
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      user: {select: {name: true}},
      orderItems: {select: {quantity: true}}
    }
  })

  return orders.map(order => ({
    id: order.id,
    customer: order.user.name || 'Customer',
    itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    amount: order.total,
    status: order.status,
    createdAt: order.createdAt.toISOString()
  }))
}

const getTopSellers = async (range: DashboardRange) => {
  const {start, end} = getRangeBounds(range)
  const statuses = Prisma.join(QUALIFYING_ORDER_STATUSES)
  const rows = await prisma.$queryRaw<SellerMetricRow[]>(Prisma.sql`
    SELECT s.id,
           s."storeName",
           COALESCE(SUM(oi.quantity), 0)::int AS "unitsSold",
           COALESCE(SUM(oi."finalPriceAfterDiscount"), 0)::double precision AS revenue,
           COUNT(DISTINCT o.id)::int AS orders,
           COUNT(DISTINCT CASE WHEN p.status = 'ACTIVE' THEN p.id END)::int AS "activeProducts"
    FROM "order_item" oi
    INNER JOIN "order" o ON o.id = oi."orderId"
    INNER JOIN "product" p ON p.id = oi."productId"
    INNER JOIN "seller" s ON s.id = p."sellerId"
    WHERE o.status IN (${statuses})
      AND o."createdAt" >= ${start}
      AND o."createdAt" < ${end}
    GROUP BY s.id
    ORDER BY revenue DESC, "unitsSold" DESC, s."storeName" ASC
    LIMIT 5
  `)

  return rows.map(row => ({
    id: row.id,
    storeName: row.storeName,
    unitsSold: normalizeCount(row.unitsSold),
    revenue: Number(row.revenue ?? 0),
    orders: normalizeCount(row.orders),
    activeProducts: normalizeCount(row.activeProducts)
  }))
}

const requireSeller = async () => {
  const session = await getSession()
  if (!session || session.user.role !== USER_ROLE.SELLER) throw new Error('Seller dashboard access required')

  const seller = await prisma.seller.findUnique({where: {userId: session.user.id}, select: {id: true, storeName: true}})
  if (!seller) throw new Error('Seller profile not found')
  return seller
}

export const getSellerDashboardData = async (range: DashboardRange): Promise<SellerDashboardData> => {
  const seller = await requireSeller()
  const normalizedRange = normalizeDashboardRange(range)
  const {start, end} = getRangeBounds(normalizedRange)
  const orderItemWhere: Prisma.OrderItemWhereInput = {
    order: {createdAt: {gte: start, lt: end}, status: {in: [...QUALIFYING_ORDER_STATUSES]}},
    product: {sellerId: seller.id}
  }
  const orderWhere: Prisma.OrderWhereInput = {
    createdAt: {gte: start, lt: end},
    status: {in: [...QUALIFYING_ORDER_STATUSES]},
    OR: [
      {sellerId: seller.id},
      {orderItems: {some: {product: {sellerId: seller.id}}}}
    ]
  }

  const [inventory, revenue, orders, unitsSold, review, revenueSeries, recentOrders, topProducts] = await Promise.all([
    getSellerInventory(seller.id),
    prisma.orderItem.aggregate({where: orderItemWhere, _sum: {finalPriceAfterDiscount: true}}),
    prisma.order.count({where: orderWhere}),
    prisma.orderItem.aggregate({where: orderItemWhere, _sum: {quantity: true}}),
    prisma.review.aggregate({where: {product: {sellerId: seller.id}, isPublished: true}, _avg: {rating: true}, _count: {id: true}}),
    getRevenueRows(normalizedRange, seller.id),
    getSellerRecentOrders(seller.id, normalizedRange),
    getTopProducts(normalizedRange, seller.id)
  ])
  const revenueTotal = Number(revenue._sum.finalPriceAfterDiscount ?? 0)
  const orderTotal = orders

  return {
    role: 'SELLER',
    range: normalizedRange,
    storeName: seller.storeName,
    revenueSeries,
    summary: {
      revenue: revenueTotal,
      orders: orderTotal,
      products: inventory.summary.products,
      unitsSold: normalizeCount(unitsSold._sum.quantity),
      averageOrderValue: orderTotal ? revenueTotal / orderTotal : 0,
      rating: review._avg.rating ?? null,
      reviewCount: review._count.id
    },
    productStatus: {
      active: inventory.summary.active,
      inactive: inventory.summary.inactive,
      outOfStock: inventory.summary.outOfStock
    },
    recentOrders,
    topProducts,
    inventoryAttention: inventory.attention
  }
}

export const getAdminDashboardData = async (range: DashboardRange): Promise<AdminDashboardData> => {
  const session = await getSession()
  if (!session || session.user.role !== USER_ROLE.ADMIN) throw new Error('Administrator dashboard access required')

  const normalizedRange = normalizeDashboardRange(range)
  const {start, end} = getRangeBounds(normalizedRange)
  const orderWhere: Prisma.OrderWhereInput = {
    createdAt: {gte: start, lt: end},
    status: {in: [...QUALIFYING_ORDER_STATUSES]}
  }

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
    topProducts
  ] = await Promise.all([
    prisma.order.aggregate({where: orderWhere, _sum: {total: true}}),
    prisma.order.count({where: orderWhere}),
    prisma.user.count({where: {role: USER_ROLE.USER}}),
    prisma.seller.count(),
    prisma.product.count(),
    prisma.product.count({where: {status: PRODUCT_STATUS.ACTIVE}}),
    prisma.order.count({where: {status: ORDER_STATUS.PENDING}}),
    prisma.order.groupBy({where: {createdAt: {gte: start, lt: end}}, by: ['status'], _count: {id: true}}),
    getRevenueRows(normalizedRange),
    getAdminRecentOrders(normalizedRange),
    getTopSellers(normalizedRange),
    getTopProducts(normalizedRange)
  ])
  const revenueTotal = Number(revenue._sum.total ?? 0)

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
      pendingOrders
    },
    orderStatuses: orderStatuses.map(item => ({status: item.status, count: item._count.id})),
    recentOrders,
    topSellers,
    topProducts
  }
}
