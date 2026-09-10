import { getCurrentUserID } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';

const CheckoutSuccessPage = async ({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) => {
  const userId = await getCurrentUserID();
  if (!userId) redirect('/sign-in?next=/checkout/success');

  const { orderId } = await searchParams;

  // Fall back to the customer's latest order for older links without an order ID.
  if (!orderId) {
    const pending = await prisma.orderGroup.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
    if (!pending) {
      return (
        <main className="max-w-4xl mx-auto py-12 px-4 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">No order found</h1>
          <p className="text-muted-foreground mb-6">Could not find the order you&apos;re looking for.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </main>
      );
    }
    return <OrderSummary orderGroup={pending} />;
  }

  const orderGroup = await prisma.orderGroup.findUnique({
    where: { id: orderId, userId },
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

  return <OrderSummary orderGroup={orderGroup} />;
};

type OrderGroupWithOrders = {
  id: string;
  userId: string;
  totalAmount: number;
  paymentMethod: string | null;
  paymentStatus: string;
  shippingFullName: string | null;
  shippingPhoneNumber: string | null;
  shippingRegion: string | null;
  shippingCity: string | null;
  shippingPostalCode: string | null;
  shippingStreet: string | null;
  createdAt: Date;
  orders: Array<{
    id: string;
    total: number;
    shippingFee?: number | null;
    status: string;
    seller: { storeName?: string | null } | null;
    shippingMethod: { name: string; price: number; estimatedDays: number } | null;
    orderItems: Array<{
      id: string;
      product?: { name?: string | null } | null;
      variant: { name: string };
      quantity: number;
      finalPriceAfterDiscount: number;
    }>;
  }>;
};

const OrderSummary = ({ orderGroup }: { orderGroup: NonNullable<OrderGroupWithOrders> }) => {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
      <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
      <h1 className="mb-2 text-2xl font-bold md:text-3xl">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-6">
        Your cash-on-delivery order has been placed. Order ID: <span className="font-mono font-bold">{orderGroup.id}</span>.
      </p>

      <div className="border rounded-lg p-6 bg-card text-left max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="space-y-4">
          <div className="grid gap-3 border-b pb-4 text-sm sm:grid-cols-2">
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
            <div key={order.id} className="border-b pb-4 last:border-0 last:pb-0">
              <p className="font-semibold">{order.seller?.storeName || 'Seller'}</p>
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-medium">{order.status}</span>
              </p>

              {/* Shipping info per seller order */}
              {order.shippingMethod && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {order.shippingMethod.name} — ${order.shippingFee?.toFixed(2) || '0.00'}
                    {' '}({order.shippingMethod.estimatedDays}–{order.shippingMethod.estimatedDays + 3} days)
                  </span>
                </div>
              )}

              <p className="font-bold mt-1">${order.total.toFixed(2)}</p>
              <div className="mt-2 space-y-1 text-sm">
                {order.orderItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name} — {item.variant.name} × {item.quantity}
                    </span>
                    <span>${item.finalPriceAfterDiscount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${orderGroup.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
        <Button size="lg" variant="outline" asChild>
          <Link href="/orders">View Orders</Link>
        </Button>
      </div>
    </main>
  );
};

export default CheckoutSuccessPage;
