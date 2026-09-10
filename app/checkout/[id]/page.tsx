import { getCurrentUserID } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

const OrderDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const userId = await getCurrentUserID();
  if (!userId) redirect('/sign-in?next=/checkout');

  const { id } = await params;

  const orderGroup = await prisma.orderGroup.findUnique({
    where: { id, userId },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              variant: true,
              product: true,
            },
          },
          seller: true,
          shippingMethod: true,
        },
      },
    },
  });

  if (!orderGroup) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-muted-foreground mb-6">We couldn&apos;t find an order with that ID.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/orders">← Back to Orders</Link>
      </Button>

      <div className="border rounded-lg p-6 bg-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order {orderGroup.id}</h1>
            <p className="text-muted-foreground">Placed on {formatDate(orderGroup.createdAt, 'MM/DD/YYYY')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">${orderGroup.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid gap-4 border-t pt-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Payment</p>
            <p className="font-medium">
              {orderGroup.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Payment method unavailable'} ·{' '}
              {orderGroup.paymentStatus}
            </p>
          </div>
          {orderGroup.shippingFullName && (
            <div>
              <p className="text-muted-foreground">Deliver to</p>
              <p className="font-medium">{orderGroup.shippingFullName}</p>
              <p>{orderGroup.shippingPhoneNumber}</p>
              <p>
                {orderGroup.shippingStreet}, {orderGroup.shippingCity}, {orderGroup.shippingRegion}{' '}
                {orderGroup.shippingPostalCode}
              </p>
            </div>
          )}
        </div>

        {orderGroup.orders.map(order => (
          <div key={order.id} className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{order.seller?.storeName || 'Seller'}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'PAID'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : order.status === 'SHIPPED'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Shipping info per seller order */}
            {order.shippingMethod && (
              <div className="flex items-center gap-2 text-sm mb-4 p-3 rounded-lg bg-muted/50">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span>
                  <strong>{order.shippingMethod.name}</strong> — ${order.shippingFee?.toFixed(2) || '0.00'}
                  {' '}({order.shippingMethod.estimatedDays}–{order.shippingMethod.estimatedDays + 3} days)
                </span>
              </div>
            )}

            <div className="space-y-3">
              {order.orderItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  {item.product?.images[0] && (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.variant.name} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">${item.finalPriceAfterDiscount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Shipping summary */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Information
          </h2>
          {orderGroup.orders.some(o => o.shippingMethod) ? (
            <div className="space-y-2">
              {orderGroup.orders.map(order => (
                order.shippingMethod && (
                  <div key={order.id} className="text-sm">
                    <span className="font-medium">{order.seller?.storeName || 'Seller'}:</span>{' '}
                    {order.shippingMethod.name} — ${order.shippingFee?.toFixed(2) || '0.00'}
                    {' '}({order.shippingMethod.estimatedDays}–{order.shippingMethod.estimatedDays + 3} days)
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No shipping information available yet.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
