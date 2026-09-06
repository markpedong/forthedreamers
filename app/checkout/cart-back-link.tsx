'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

const CartBackLink: FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/cart' as never)}
      className='flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 cursor-pointer'
    >
      Back to Cart
    </button>
  );
};

export default CartBackLink;
