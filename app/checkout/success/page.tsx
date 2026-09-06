import { getSession } from "@/lib/server-actions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import OrdersBackLink from "../orders-back-link";

const CheckoutSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) => {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/checkout/success");

  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No order found</h1>
        <p className="text-muted-foreground mb-6">
          Could not find the order you&apos;re looking for.
        </p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  const orderGroup = await prisma.orderGroup.findUnique({
    where: { id: orderId },
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
        },
      },
    },
  });

  if (!orderGroup) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find an order with that ID.
        </p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
      <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for your purchase. Your order ID is <span className="font-mono font-bold">{orderGroup.id}</span>.
      </p>

      <div className="border rounded-lg p-6 bg-card text-left max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="space-y-4">
          {orderGroup.orders.map((order) => (
            <div key={order.id} className="border-b pb-4 last:border-0 last:pb-0">
              <p className="font-semibold">{order.seller?.storeName || "Seller"}</p>
              <p className="text-sm text-muted-foreground">
                Status: <span className={`font-medium ${order.status === "PAID" ? "text-green-500" : ""}`}>{order.status}</span>
              </p>
              <p className="font-bold mt-1">${order.total.toFixed(2)}</p>
              <div className="mt-2 space-y-1 text-sm">
                {order.orderItems.map((item) => (
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
        <OrdersBackLink />
      </div>
    </main>
  );
};

export default CheckoutSuccessPage;
