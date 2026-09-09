import type { Address, ShippingMethod } from '@/generated/prisma';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/services/auth';
import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CheckoutPageClient from './page-client';

const CheckoutPage = async () => {
  const session = await getSession();
  if (!session) redirect('/sign-in?next=/checkout');

  const [cartItems, addresses, shippingMethods] = await Promise.all([
    prisma.cartItem.findMany({
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
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    }),
    prisma.shippingMethod.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    }),
  ]);

  if (cartItems.length === 0) {
    return (
      <main className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Nothing to checkout</h1>
        <p className="text-muted-foreground mb-6">Your cart is empty. Add some products and come back.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <CheckoutPageClient
      cartItems={cartItems}
      addresses={addresses}
      shippingMethods={shippingMethods}
    />
  );
};

export const dynamic = 'force-dynamic';
export default CheckoutPage;
