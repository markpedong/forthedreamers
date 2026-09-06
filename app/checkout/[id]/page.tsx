import { getSession } from "@/lib/server-actions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Truck } from "lucide-react";
import Link from "next/link";
import OrdersBackLink from "../orders-back-link";

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/checkout");

  const { id } = await params;

  const orderGroup = await prisma.orderGroup.findUnique({
    where: { id },
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
    <main className="max-w-4xl mx-auto py-8 px-4">
      <OrdersBackLink />

      <div className="border rounded-lg p-6 bg-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order {orderGroup.id}</h1>
            <p className="text-muted-foreground">
              Placed on {orderGroup.createdAt.toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">${orderGroup.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {orderGroup.orders.map((order) => (
          <div key={order.id} className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{order.seller?.storeName || "Seller"}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "PAID"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : order.status === "SHIPPED"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  {item.variant.image && (
                    <img
                      src={item.variant.image}
                      alt={item.product?.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.variant.name} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${item.finalPriceAfterDiscount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Tracking placeholder */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Information
          </h2>
          <p className="text-muted-foreground text-sm">
            Shipping details will be available once your order is processed and shipped.
          </p>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
