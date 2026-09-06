'use client';

import { FC } from 'react';
import { useCartCount } from '@/components/provider/cart-count-provider';

const CartItemCount: FC = () => {
  const { count } = useCartCount();
  if (count === 0) return null;

  return (
    <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CartItemCount;
