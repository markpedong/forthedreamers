'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CartNavigationProps {
  selectedIds?: string[];
}

const CartNavigation = ({ selectedIds }: CartNavigationProps) => {
  const pathname = usePathname();
  const isCheckout = pathname?.includes('/checkout');

  if (isCheckout) return null;

  const hasSelection = selectedIds && selectedIds.length > 0;

  return (
    <>
      <Button className="w-full" size="lg" asChild disabled={!hasSelection}>
        <Link href={selectedIds && selectedIds.length > 0 ? `/checkout?items=${selectedIds.join(',')}` : '/checkout'}>
          Proceed to Checkout
        </Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </>
  );
};

export default CartNavigation;
