'use client';

import { useOptimistic, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminDashboardData, DashboardProduct, DashboardRange, SellerDashboardData } from '../dashboard/types';
import { DASHBOARD_RANGES } from '../dashboard/types';

type AnalyticsData = AdminDashboardData | SellerDashboardData;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compactCurrency = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const rangeLabels = { '7d': 'Last 7 days', '30d': 'Last 30 days', '12m': 'Last 12 months' } as const;
const PIE_COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

const formatCurrency = (value: number) => currency.format(value);
const formatCompact = (value: number) => `$${compactCurrency.format(value)}`;
const formatDate = (date: string, range: DashboardRange) =>
  new Intl.DateTimeFormat('en-US', range === '12m' ? { month: 'short', year: '2-digit' } : { month: 'short', day: 'numeric' }).format(
    new Date(date)
  );
const titleCase = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

const Empty = ({ description }: { description: string }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
    <p className="text-sm font-medium">No data yet</p>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
  </div>
);

const RevenueArea = ({ data }: { data: AnalyticsData }) => {
  const hasSales = data.revenueSeries.some(point => point.revenue > 0);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue trend</CardTitle>
        <CardDescription>Paid order revenue for {rangeLabels[data.range].toLowerCase()}.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasSales ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={value => formatDate(String(value), data.range)}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                />
                <YAxis tickFormatter={value => formatCompact(Number(value))} tickLine={false} axisLine={false} width={56} />
                <Tooltip
                  labelFormatter={value => formatDate(String(value), data.range)}
                  formatter={value => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#analyticsRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty description="Revenue will appear here after a paid order is recorded." />
        )}
      </CardContent>
    </Card>
  );
};

const OrdersBar = ({ data }: { data: AnalyticsData }) => {
  const hasOrders = data.revenueSeries.some(point => point.orders > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order volume</CardTitle>
        <CardDescription>Orders recorded per period.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasOrders ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={value => formatDate(String(value), data.range)}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  labelFormatter={value => formatDate(String(value), data.range)}
                  formatter={value => [Number(value), 'Orders']}
                />
                <Bar dataKey="orders" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty description="Order counts will appear after orders are recorded." />
        )}
      </CardContent>
    </Card>
  );
};

const OrderStatusPie = ({ statuses }: { statuses: AdminDashboardData['orderStatuses'] }) => {
  const total = statuses.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order status mix</CardTitle>
        <CardDescription>Share of orders by current status.</CardDescription>
      </CardHeader>
      <CardContent>
        {total ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statuses} dataKey="count" nameKey="status" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {statuses.map((entry, index) => (
                    <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [Number(value), titleCase(String(name))]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty description="Status breakdown will appear once orders exist." />
        )}
      </CardContent>
    </Card>
  );
};

const ProductBars = ({ products }: { products: DashboardProduct[] }) => (
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Top products by revenue</CardTitle>
      <CardDescription>Best sellers in the selected period.</CardDescription>
    </CardHeader>
    <CardContent>
      {products.length ? (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={products} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={value => formatCompact(Number(value))} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={140} />
              <Tooltip formatter={value => [formatCurrency(Number(value)), 'Revenue']} />
              <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty description="Top products will appear after your first qualifying sale." />
      )}
    </CardContent>
  </Card>
);

const SellerMix = ({ data }: { data: SellerDashboardData }) => {
  const slices = [
    { status: 'Active', count: data.productStatus.active },
    { status: 'Inactive', count: data.productStatus.inactive },
    { status: 'Out of stock', count: data.productStatus.outOfStock },
  ];
  const total = slices.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catalog health</CardTitle>
        <CardDescription>Products by current status.</CardDescription>
      </CardHeader>
      <CardContent>
        {total ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices} dataKey="count" nameKey="status" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {slices.map((entry, index) => (
                    <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [Number(value), String(name)]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty description="Product breakdown will appear once products are listed." />
        )}
      </CardContent>
    </Card>
  );
};

const AnalyticsView = ({ data }: { data: AnalyticsData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [range, setRange] = useOptimistic(data.range);
  const [isPending, startTransition] = useTransition();

  const updateRange = (value: string) => {
    if (!DASHBOARD_RANGES.includes(value as DashboardRange)) return;
    const next = value as DashboardRange;
    startTransition(() => {
      setRange(next);
      const params = new URLSearchParams(searchParams.toString());
      params.set('range', next);
      router.replace(`${pathname}?${params.toString()}` as Route);
    });
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            {data.role === 'SELLER' ? data.storeName : 'ForTheDreamers'}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Trends across revenue, orders, and catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{isPending ? 'Updating…' : rangeLabels[range]}</span>
          <Select value={range} onValueChange={updateRange}>
            <SelectTrigger className="w-40" aria-label="Analytics date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueArea data={data} />
        <OrdersBar data={data} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {data.role === 'ADMIN' ? <OrderStatusPie statuses={data.orderStatuses} /> : <SellerMix data={data} />}
        <ProductBars products={data.topProducts} />
      </div>
    </div>
  );
};

export default AnalyticsView;
