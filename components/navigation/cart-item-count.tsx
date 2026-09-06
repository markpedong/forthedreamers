'use client';

import { FC } from 'react';
import { useCartItems } from '@/lib/hooks/use-cart';

const CartItemCount: FC = () => {
  const { data } = useCartItems();

  if (data === undefined) return null;

  const count = data.data?.length ?? 0;
  if (count === 0) return null;

  return (
    <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CartItemCount;
