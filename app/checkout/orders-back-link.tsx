'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

const OrdersBackLink: FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/profile/orders' as never)}
      className='flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 cursor-pointer'
    >
      Back to Orders
    </button>
  );
};

export default OrdersBackLink;
