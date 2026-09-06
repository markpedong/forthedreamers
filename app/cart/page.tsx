import { getSession } from "@/lib/server-actions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import CartItemsList from "./cart-items-list";
import CartNavigation from "./cart-navigation";

const CartPage = async () => {
  const session = await getSession();
  if (!session) redirect("/sign-in?next=/cart");

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      variant: {
        include: {
          product: {
            include: {
              seller: true,
            },
          },
        },
      },
      product: true,
    },
  });

  if (cartItems.length === 0) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const price = item.variant.discountedPrice ?? item.variant.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <CartItemsList items={cartItems} />
        </div>

        <div className="order-first lg:order-last">
          <div className="p-6 border rounded-lg bg-card space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <CartNavigation />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
