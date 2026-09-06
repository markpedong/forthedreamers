'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useCartItems } from '@/lib/hooks/use-cart';

const CartBackLink: FC = () => {
  const router = useRouter();
  const { isLoading } = useCartItems();

  return (
    <button
      onClick={() => router.push('/cart' as never)}
      className='flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 cursor-pointer'
      disabled={isLoading}
    >
      Back to Cart
    </button>
  );
};

export default CartBackLink;
