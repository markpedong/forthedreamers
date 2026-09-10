'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrdersQuery } from '@/services/useQuery';
import WriteReview from './components/write-review';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const dates = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [sortBy, order] = sort.split(':');
  const ordersQuery = useOrdersQuery(page, status, sortBy, order);
  const data = ordersQuery.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Account</p>
          <h1 className="mt-2 text-4xl font-light tracking-tight">Order history</h1>
        </div>
        <div className="flex gap-3">
          <select value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} aria-label="Order status" className="h-9 border border-input bg-background px-3 text-sm">
            <option value="">All statuses</option>
            {['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDED'].map(value => <option key={value} value={value}>{value.replace('_', ' ')}</option>)}
          </select>
          <select value={sort} onChange={event => { setSort(event.target.value); setPage(1); }} aria-label="Sort orders" className="h-9 border border-input bg-background px-3 text-sm">
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="total:desc">Highest total</option>
            <option value="total:asc">Lowest total</option>
          </select>
        </div>
      </header>

      {ordersQuery.isLoading ? (
        <p className="py-20 text-center text-muted-foreground">Loading orders…</p>
      ) : ordersQuery.isError ? (
        <div className="space-y-4 py-20 text-center">
          <p className="text-destructive">{ordersQuery.error.message}</p>
          <Button asChild><Link href="/sign-in?next=/orders">Sign in</Link></Button>
        </div>
      ) : !data?.orders.length ? (
        <div className="space-y-4 py-20 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-medium">No orders found</h2>
          <p className="text-sm text-muted-foreground">Orders matching this status will appear here.</p>
          <Button asChild><Link href="/products">Start shopping</Link></Button>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {data.orders.map(orderItem => (
              <article key={orderItem.id} className="border border-border bg-card">
                <header className="grid gap-4 border-b border-border p-5 text-sm sm:grid-cols-5">
                  <div><p className="text-xs uppercase text-muted-foreground">Order number</p><p className="mt-1 font-medium">#{orderItem.id}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Date</p><p className="mt-1">{dates.format(new Date(orderItem.createdAt))}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Total</p><p className="mt-1 font-medium">{money.format(orderItem.total)}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Payment</p><p className="mt-1">{orderItem.orderGroup?.paymentMethod === 'CASH_ON_DELIVERY' ? `Cash on delivery · ${orderItem.orderGroup.paymentStatus}` : 'Unavailable'}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Order status</p><p className="mt-1">{orderItem.status}</p></div>
                </header>
                <div className="divide-y divide-border px-5">
                  {orderItem.orderItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-4 text-sm">
                      <div>
                        {item.product ? <Link href={`/products/${item.product.slug}`} className="font-medium hover:underline">{item.product.name}</Link> : <p className="font-medium">Product unavailable</p>}
                        <p className="text-muted-foreground">{item.variant.name} · Quantity {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">{money.format(item.finalPriceAfterDiscount)}</p>
                        {orderItem.status === 'COMPLETED' &&
                          item.product &&
                          (item.product.reviews.length ? (
                            <span className="text-xs text-muted-foreground">Reviewed</span>
                          ) : (
                            <WriteReview slug={item.product.slug} productName={item.product.name} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <nav aria-label="Order pagination" className="mt-10 flex items-center justify-center gap-4">
            <Button variant="outline" disabled={page <= 1 || ordersQuery.isFetching} onClick={() => setPage(value => value - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
            <Button variant="outline" disabled={page >= pages || ordersQuery.isFetching} onClick={() => setPage(value => value + 1)}>Next</Button>
          </nav>
        </>
      )}
    </main>
  );
}
