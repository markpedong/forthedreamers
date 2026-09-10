'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useOptimistic, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, CircleAlert, CircleDollarSign, Package, ShoppingCart, Star, Store, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type {
  AdminDashboardData,
  DashboardOrder,
  DashboardPoint,
  DashboardProduct,
  DashboardRange,
  SellerDashboardData,
} from './types';
import { DASHBOARD_RANGES, LOW_STOCK_THRESHOLD } from './types';

type DashboardData = AdminDashboardData | SellerDashboardData;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const rangeLabels = { '7d': 'Last 7 days', '30d': 'Last 30 days', '12m': 'Last 12 months' } as const;

const formatCurrency = (value: number) => currency.format(value);
const formatNumber = (value: number) => value.toLocaleString('en-US');
const formatCompactCurrency = (value: number) => `$${compactNumber.format(value)}`;
const formatChartDate = (date: string, range: DashboardData['range']) =>
  new Intl.DateTimeFormat(
    'en-US',
    range === '12m' ? { month: 'short', year: '2-digit' } : { month: 'short', day: 'numeric' }
  ).format(new Date(date));
const formatOrderDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
const formatStatus = (status: string) => status.charAt(0) + status.slice(1).toLowerCase();

const statusClass = (status: string) => {
  if (status === 'COMPLETED' || status === 'PAID' || status === 'ACTIVE')
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
  if (status === 'CANCELLED' || status === 'REFUNDED' || status === 'INACTIVE')
    return 'bg-destructive/10 text-destructive';
  if (status === 'SHIPPED') return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
  return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(status)}`}>
    {formatStatus(status)}
  </span>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
    <p className="text-sm font-medium">{title}</p>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
  </div>
);

const MetricCard = ({
  label,
  value,
  context,
  icon: Icon,
}: {
  label: string;
  value: string;
  context: string;
  icon: LucideIcon;
}) => (
  <Card className="gap-4 py-5">
    <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pb-0">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <span className="rounded-lg bg-muted p-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
    </CardHeader>
    <CardContent className="px-5">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{context}</p>
    </CardContent>
  </Card>
);

const DashboardHeader = ({ data }: { data: DashboardData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedRange, setSelectedRange] = useOptimistic(data.range);
  const [isPending, startTransition] = useTransition();

  const updateRange = (value: string) => {
    if (!DASHBOARD_RANGES.includes(value as DashboardRange)) return;
    const nextRange = value as DashboardRange;
    startTransition(() => {
      setSelectedRange(nextRange);
      const params = new URLSearchParams(searchParams.toString());
      params.set('range', nextRange);
      router.replace(`${pathname}?${params.toString()}` as Route);
    });
  };

  const isSeller = data.role === 'SELLER';

  return (
    <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">{isSeller ? data.storeName : 'ForTheDreamers'}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
          {isSeller ? 'Store overview' : 'Platform overview'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSeller
            ? 'Keep an eye on sales, products, and stock that need your attention.'
            : 'A live view of orders, customers, sellers, and platform sales.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{isPending ? 'Updating…' : rangeLabels[selectedRange]}</span>
        <Select value={selectedRange} onValueChange={updateRange}>
          <SelectTrigger className="w-40" aria-label="Dashboard date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
        <Button asChild>
          <Link href="/dashboard/products">
            <Package className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>
    </header>
  );
};

const RevenueChart = ({ series, range }: { series: DashboardPoint[]; range: DashboardData['range'] }) => {
  const hasSales = series.some(point => point.revenue > 0);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Paid order revenue and order volume for {rangeLabels[range].toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasSales ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={value => formatChartDate(String(value), range)}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                />
                <YAxis
                  yAxisId="revenue"
                  tickFormatter={value => formatCompactCurrency(Number(value))}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  labelFormatter={value => formatChartDate(String(value), range)}
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : formatNumber(Number(value)),
                    name === 'revenue' ? 'Revenue' : 'Orders',
                  ]}
                />
                <Bar
                  yAxisId="orders"
                  dataKey="orders"
                  fill="var(--color-chart-2)"
                  opacity={0.28}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState title="No sales yet" description="Revenue will appear here after a paid order is recorded." />
        )}
      </CardContent>
    </Card>
  );
};

const OrderStatusSummary = ({ statuses }: { statuses: AdminDashboardData['orderStatuses'] }) => {
  const total = statuses.reduce((sum, status) => sum + status.count, 0);
  const maximum = Math.max(...statuses.map(status => status.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order status</CardTitle>
        <CardDescription>Orders in the selected period, grouped by their current status.</CardDescription>
      </CardHeader>
      <CardContent>
        {total ? (
          <div className="space-y-4">
            {statuses.map(status => (
              <div key={status.status}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2">
                    <StatusBadge status={status.status} />
                  </span>
                  <span className="font-medium">{formatNumber(status.count)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(status.count / maximum) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No orders in this period"
            description="Status counts will appear after qualifying orders are recorded."
          />
        )}
      </CardContent>
    </Card>
  );
};

const RecentOrders = ({ orders, seller }: { orders: DashboardOrder[]; seller?: boolean }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent orders</CardTitle>
      <CardDescription>
        {seller ? 'Orders containing your products.' : 'Latest qualifying orders across the platform.'}
      </CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      {orders.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y bg-muted/30 text-left text-xs text-muted-foreground">
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b transition-colors last:border-0 hover:bg-muted/20">
                  <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 10)}</td>
                  <td className="px-4 py-4">{order.customer}</td>
                  <td className="px-4 py-4 text-muted-foreground">{formatNumber(order.itemCount)}</td>
                  <td className="px-4 py-4 font-medium">{formatCurrency(order.amount)}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{formatOrderDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState title="No orders yet" description="Orders will appear here after a qualifying payment." />
        </div>
      )}
    </CardContent>
  </Card>
);

const TopProducts = ({ products }: { products: DashboardProduct[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Top products</CardTitle>
      <CardDescription>Best sellers by units and revenue in the selected period.</CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      {products.length ? (
        <div className="divide-y">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-3 px-6 py-4">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-muted">
                {product.image ? (
                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Package className="m-3 h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatNumber(product.unitsSold)} units · {formatCurrency(product.revenue)}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={product.status} />
                <p className="mt-1 text-xs text-muted-foreground">{formatNumber(product.stock)} in stock</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6">
          <EmptyState title="No sales yet" description="Top products will appear after your first qualifying sale." />
        </div>
      )}
    </CardContent>
  </Card>
);

const InventoryAttention = ({ products }: { products: SellerDashboardData['inventoryAttention'] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Inventory attention</CardTitle>
      <CardDescription>Active products with {LOW_STOCK_THRESHOLD} or fewer units available.</CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      {products.length ? (
        <div className="divide-y">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-3 px-6 py-4">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                {product.image ? (
                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <CircleAlert className="m-2.5 h-5 w-5 text-amber-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.stock ? `${formatNumber(product.stock)} units remaining` : 'Out of stock'}
                </p>
              </div>
              <StatusBadge status={product.status} />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6">
          <EmptyState title="Stock looks healthy" description="Products needing attention will appear here." />
        </div>
      )}
    </CardContent>
  </Card>
);

const ProductStatusSummary = ({ data }: { data: SellerDashboardData['productStatus'] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Catalog health</CardTitle>
      <CardDescription>Current product and stock status.</CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-3 gap-3">
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-2xl font-semibold">{formatNumber(data.active)}</p>
        <p className="mt-1 text-xs text-muted-foreground">Active</p>
      </div>
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-2xl font-semibold">{formatNumber(data.inactive)}</p>
        <p className="mt-1 text-xs text-muted-foreground">Inactive</p>
      </div>
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-2xl font-semibold">{formatNumber(data.outOfStock)}</p>
        <p className="mt-1 text-xs text-muted-foreground">Out of stock</p>
      </div>
    </CardContent>
  </Card>
);

const TopSellers = ({ sellers }: { sellers: AdminDashboardData['topSellers'] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Seller performance</CardTitle>
      <CardDescription>Top sellers by paid order-item revenue in the selected period.</CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      {sellers.length ? (
        <div className="divide-y">
          {sellers.map(seller => (
            <div key={seller.id} className="flex items-center gap-3 px-6 py-4">
              <div className="rounded-lg bg-muted p-2">
                <Store className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{seller.storeName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatNumber(seller.orders)} orders · {formatNumber(seller.unitsSold)} units
                </p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(seller.revenue)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6">
          <EmptyState
            title="No seller sales yet"
            description="Seller performance will appear after the platform records paid orders."
          />
        </div>
      )}
    </CardContent>
  </Card>
);

const SellerDashboard = ({ data }: { data: SellerDashboardData }) => {
  const cards = [
    {
      label: 'Revenue',
      value: formatCurrency(data.summary.revenue),
      context: rangeLabels[data.range],
      icon: CircleDollarSign,
    },
    { label: 'Orders', value: formatNumber(data.summary.orders), context: rangeLabels[data.range], icon: ShoppingCart },
    {
      label: 'Units sold',
      value: formatNumber(data.summary.unitsSold),
      context: rangeLabels[data.range],
      icon: ArrowUpRight,
    },
    {
      label: 'Average order',
      value: formatCurrency(data.summary.averageOrderValue),
      context: 'Per qualifying order',
      icon: CircleDollarSign,
    },
    {
      label: 'Products',
      value: formatNumber(data.summary.products),
      context: `${formatNumber(data.productStatus.active)} active`,
      icon: Package,
    },
    {
      label: 'Rating',
      value: data.summary.rating === null ? 'No reviews' : `${data.summary.rating.toFixed(1)} / 5`,
      context:
        data.summary.rating === null
          ? 'Reviews will appear here'
          : `${formatNumber(data.summary.reviewCount)} published reviews`,
      icon: Star,
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(card => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart series={data.revenueSeries} range={data.range} />
        <div className="space-y-6">
          <ProductStatusSummary data={data.productStatus} />
          <InventoryAttention products={data.inventoryAttention} />
        </div>
      </div>
      <RecentOrders orders={data.recentOrders} seller />
      <TopProducts products={data.topProducts} />
    </>
  );
};

const AdminDashboard = ({ data }: { data: AdminDashboardData }) => {
  const cards = [
    {
      label: 'Gross revenue',
      value: formatCurrency(data.summary.revenue),
      context: rangeLabels[data.range],
      icon: CircleDollarSign,
    },
    { label: 'Orders', value: formatNumber(data.summary.orders), context: rangeLabels[data.range], icon: ShoppingCart },
    {
      label: 'Customers',
      value: formatNumber(data.summary.customers),
      context: 'Registered customer accounts',
      icon: Users,
    },
    { label: 'Sellers', value: formatNumber(data.summary.sellers), context: 'Seller profiles', icon: Store },
    {
      label: 'Products',
      value: formatNumber(data.summary.products),
      context: `${formatNumber(data.summary.activeProducts)} active`,
      icon: Package,
    },
    {
      label: 'Pending orders',
      value: formatNumber(data.summary.pendingOrders),
      context: 'Awaiting payment or processing',
      icon: CircleAlert,
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(card => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart series={data.revenueSeries} range={data.range} />
        <OrderStatusSummary statuses={data.orderStatuses} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders orders={data.recentOrders} />
        <TopSellers sellers={data.topSellers} />
      </div>
      <TopProducts products={data.topProducts} />
    </>
  );
};

const DashboardView = ({ data }: { data: DashboardData }) => (
  <div className="mx-auto max-w-[1600px] space-y-6">
    <DashboardHeader data={data} />
    {data.role === 'SELLER' ? <SellerDashboard data={data} /> : <AdminDashboard data={data} />}
  </div>
);

export default DashboardView;
