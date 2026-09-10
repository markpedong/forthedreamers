import { getCurrentUserID } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CheckoutPageClient from './page-client';

const CheckoutPage = async (props: { searchParams: Promise<{ items?: string }> }) => {
  const userId = await getCurrentUserID();
  if (!userId) redirect('/sign-in?next=/checkout');

  const searchParams = await props.searchParams;
  const selectedIds = searchParams.items?.split(',').filter(Boolean) ?? [];

  let cartItems;
  if (selectedIds.length > 0) {
    cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
        id: { in: selectedIds },
      },
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
  } else {
    cartItems = await prisma.cartItem.findMany({
      where: { userId },
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
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  });

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

  const sellerIds = [...new Set(cartItems.map(item => item.variant.product.sellerId))];
  const sellers = await prisma.seller.findMany({
    where: { id: { in: sellerIds } },
    select: {
      id: true,
      storeName: true,
      shippingMethods: { where: { isActive: true }, select: { code: true } },
    },
  });
  const sellerShippingMethods = sellerIds.map(sellerId => {
    const seller = sellers.find(candidate => candidate.id === sellerId);
    const fallbackName = cartItems.find(item => item.variant.product.sellerId === sellerId)?.variant.product.seller.storeName;
    return {
      sellerId,
      storeName: seller?.storeName ?? fallbackName ?? 'Seller',
      courierCodes: seller?.shippingMethods.map(method => method.code) ?? [],
    };
  });

  return (
    <CheckoutPageClient
      cartItems={cartItems}
      addresses={addresses}
      sellerShippingMethods={sellerShippingMethods}
    />
  );
};

export const dynamic = 'force-dynamic';
export default CheckoutPage;
