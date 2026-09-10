'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Package, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { OrderResult } from '@/lib/http';
import WriteReview from './write-review';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const dates = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

const formatStatus = (status: string) =>
  status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');

const statusVariant = (status: string) => {
  if (status === 'COMPLETED' || status === 'PAID') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
  if (status === 'CANCELLED' || status === 'REFUNDED') return 'bg-destructive/10 text-destructive';
  if (status === 'SHIPPED') return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
  return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-b border-border px-4 py-4 last:border-b-0 md:px-6">
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
    {children}
  </section>
);

const SummaryRow = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className="flex items-baseline justify-between gap-4 py-1 text-sm">
    <span className={strong ? 'font-medium' : 'text-muted-foreground'}>{label}</span>
    <span className={strong ? 'text-base font-semibold' : ''}>{value}</span>
  </div>
);

const OrderDetailDialog = ({ order, onClose }: { order: OrderResult | null; onClose: () => void }) => {
  const address = order?.orderGroup;
  const addressLines = address
    ? [
        address.shippingStreet,
        [address.shippingCity, address.shippingRegion, address.shippingPostalCode].filter(Boolean).join(', '),
      ].filter(Boolean)
    : [];

  const subtotal = order?.orderItems.reduce((sum, item) => sum + item.finalPriceAfterDiscount, 0) ?? 0;
  const shippingFee = order?.shippingFee ?? 0;
  const discount = order?.discount ?? 0;

  return (
    <Dialog open={!!order} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-4 py-4 text-left md:px-6">
          <DialogTitle>Order details</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-mono text-xs">#{order?.id}</span>
            {order && <span aria-hidden>·</span>}
            {order && <span>{dates.format(new Date(order.createdAt))}</span>}
          </DialogDescription>
        </DialogHeader>

        {order && (
          <>
            <Section title="Delivery address">
              {addressLines.length ? (
                <address className="text-sm not-italic leading-relaxed">
                  {address?.shippingFullName && <p className="font-medium">{address.shippingFullName}</p>}
                  {address?.shippingPhoneNumber && (
                    <p className="text-muted-foreground">{address.shippingPhoneNumber}</p>
                  )}
                  {addressLines.map((line, index) => (
                    <p key={index} className="text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </address>
              ) : (
                <p className="text-sm text-muted-foreground">No delivery address on record.</p>
              )}
            </Section>

            <Section title="Seller">
              <div className="flex items-center gap-2 text-sm">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.seller?.storeName ?? 'Marketplace seller'}</span>
              </div>
            </Section>

            <Section title={`Items (${order.orderItems.length})`}>
              <div className="divide-y divide-border">
                {order.orderItems.map(item => (
                  <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <Link
                      href={item.product ? `/products/${item.product.slug}` : '/orders'}
                      onClick={onClose}
                      className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
                    >
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="56px"
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
                              onClick={onClose}
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
                        <div className="shrink-0 text-right">
                          {item.discountedPriceAtPurchase !== null &&
                            item.discountedPriceAtPurchase < item.priceAtPurchase && (
                              <p className="text-xs text-muted-foreground line-through">
                                {money.format(item.priceAtPurchase * item.quantity)}
                              </p>
                            )}
                          <p className="text-sm font-semibold">{money.format(item.finalPriceAfterDiscount)}</p>
                        </div>
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
            </Section>

            <Section title="Order summary">
              <SummaryRow label="Merchandise subtotal" value={money.format(subtotal)} />
              <SummaryRow label="Shipping fee" value={money.format(shippingFee)} />
              {discount > 0 && <SummaryRow label="Discount" value={`−${money.format(discount)}`} />}
              <div className="mt-2 border-t border-border pt-2">
                <SummaryRow label="Order total" value={money.format(order.total)} strong />
              </div>
            </Section>

            <Section title="Payment">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {order.orderGroup?.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on delivery' : 'Payment unavailable'}
                </span>
                <Badge className={statusVariant(order.orderGroup?.paymentStatus ?? order.status)}>
                  {formatStatus(order.orderGroup?.paymentStatus ?? order.status)}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Order status</span>
                <Badge className={statusVariant(order.status)}>{formatStatus(order.status)}</Badge>
              </div>
            </Section>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
