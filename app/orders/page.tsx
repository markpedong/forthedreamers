'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrdersQuery } from '@/services/useQuery';
import WriteReview from './components/write-review';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const dates = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

const formatStatus = (status: string) => status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');

const statusClass = (status: string) => {
  if (status === 'COMPLETED' || status === 'PAID') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
  if (status === 'CANCELLED' || status === 'REFUNDED') return 'bg-destructive/10 text-destructive';
  if (status === 'SHIPPED') return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
  return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
};

type Order = NonNullable<ReturnType<typeof useOrdersQuery>['data']>['orders'][number];

const OrderCard = ({ order }: { order: Order }) => (
  <article className="overflow-hidden rounded-lg border border-border bg-card">
    <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-border bg-muted/30 px-4 py-2.5">
      <div className="min-w-0">
        <p className="truncate font-mono text-xs text-muted-foreground" title={`#${order.id}`}>
          #{order.id}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{dates.format(new Date(order.createdAt))}</p>
      </div>
      <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(order.status)}`}>
        {formatStatus(order.status)}
      </span>
    </header>

    <div className="divide-y divide-border">
      {order.orderItems.map(item => (
        <div key={item.id} className="flex gap-3 p-3 md:gap-4 md:p-4">
          <Link
            href={item.product ? `/products/${item.product.slug}` : '/orders'}
            className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted md:size-16"
          >
            {item.product?.images?.[0] ? (
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </span>
            )}
          </Link>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {item.product ? (
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="line-clamp-2 text-sm font-medium hover:underline"
                  >
                    {item.product.name}
                  </Link>
                ) : (
                  <p className="text-sm font-medium">Product unavailable</p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.variant.name} · Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold">{money.format(item.finalPriceAfterDiscount)}</p>
            </div>

            {order.status === 'COMPLETED' &&
              item.product &&
              (item.product.reviews.length ? (
                <span className="mt-1 self-start text-xs text-muted-foreground">Reviewed</span>
              ) : (
                <div className="mt-1 self-start">
                  <WriteReview slug={item.product.slug} productName={item.product.name} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>

    <footer className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {order.orderGroup?.paymentMethod === 'CASH_ON_DELIVERY'
          ? `Cash on delivery · ${formatStatus(order.orderGroup.paymentStatus)}`
          : 'Payment unavailable'}
      </p>
      <p className="text-sm">
        <span className="text-muted-foreground">Order total </span>
        <span className="font-semibold">{money.format(order.total)}</span>
      </p>
    </footer>
  </article>
);

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [sortBy, order] = sort.split(':');
  const ordersQuery = useOrdersQuery(page, status, sortBy, order);
  const data = ordersQuery.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <header className="mb-5 md:mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Account</p>
        <h1 className="mt-1.5 text-2xl font-light tracking-tight md:mt-2 md:text-4xl">Order history</h1>
      </header>

      <div className="mb-4 flex gap-2">
        <select
          value={status}
          onChange={event => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Order status"
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm sm:flex-none"
        >
          <option value="">All statuses</option>
          {['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDED'].map(value => (
            <option key={value} value={value}>
              {formatStatus(value)}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={event => {
            setSort(event.target.value);
            setPage(1);
          }}
          aria-label="Sort orders"
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm sm:flex-none"
        >
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="total:desc">Highest total</option>
          <option value="total:asc">Lowest total</option>
        </select>
      </div>

      {ordersQuery.isLoading ? (
        <p className="py-20 text-center text-muted-foreground">Loading orders…</p>
      ) : ordersQuery.isError ? (
        <div className="space-y-4 py-20 text-center">
          <p className="text-destructive">{ordersQuery.error.message}</p>
          <Button asChild>
            <Link href="/sign-in?next=/orders">Sign in</Link>
          </Button>
        </div>
      ) : !data?.orders.length ? (
        <div className="space-y-4 py-20 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-medium">No orders found</h2>
          <p className="text-sm text-muted-foreground">Orders matching this status will appear here.</p>
          <Button asChild>
            <Link href="/products">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3 md:space-y-4">
            {data.orders.map(orderItem => (
              <OrderCard key={orderItem.id} order={orderItem} />
            ))}
          </div>
          <nav aria-label="Order pagination" className="mt-8 flex items-center justify-center gap-4 md:mt-10">
            <Button variant="outline" disabled={page <= 1 || ordersQuery.isFetching} onClick={() => setPage(value => value - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {pages}
            </span>
            <Button variant="outline" disabled={page >= pages || ordersQuery.isFetching} onClick={() => setPage(value => value + 1)}>
              Next
            </Button>
          </nav>
        </>
      )}
    </main>
  );
}
