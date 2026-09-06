'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useCartItems } from '@/lib/hooks/use-cart';
import { Button } from '@/components/ui/button';

const CartNavigation: FC = () => {
  const router = useRouter();
  const { isLoading } = useCartItems();

  return (
    <>
      <Button
        className='w-full'
        size='lg'
        onClick={() => router.push('/checkout' as never)}
        disabled={isLoading}
      >
        Proceed to Checkout
      </Button>
      <Button
        variant='outline'
        className='w-full'
        onClick={() => router.push('/')}
        disabled={isLoading}
      >
        Continue Shopping
      </Button>
    </>
  );
};

export default CartNavigation;
