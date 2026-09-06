'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const CartNavigation: FC = () => {
  const router = useRouter();

  return (
    <>
      <Button
        className='w-full'
        size='lg'
        onClick={() => router.push('/checkout' as never)}
      >
        Proceed to Checkout
      </Button>
      <Button
        variant='outline'
        className='w-full'
        onClick={() => router.push('/')}
      >
        Continue Shopping
      </Button>
    </>
  );
};

export default CartNavigation;
