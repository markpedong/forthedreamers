'use client';

import { useAppSelector } from '@/redux/store';
import { useCartCountQuery } from '@/services/useQuery';

const CartItemCount = () => {
  const user = useAppSelector(state => state.userData.data);
  const { data: count = 0 } = useCartCountQuery(Boolean(user));
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CartItemCount;
