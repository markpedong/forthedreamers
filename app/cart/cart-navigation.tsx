'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CartNavigation = () => {
  return (
    <>
      <Button className="w-full" size="lg" asChild>
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </>
  );
};

export default CartNavigation;
