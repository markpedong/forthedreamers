'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/lib/hooks/use-cart';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceOrderButtonProps {
  total: number;
}

const PlaceOrderButton: FC<PlaceOrderButtonProps> = ({ total }) => {
  const router = useRouter();
  const checkoutMutation = useCheckout();

  const handlePlaceOrder = () => {
    checkoutMutation.mutate(
      undefined,
      {
        onSuccess: (data) => {
          router.push(`/checkout/success?orderId=${data.data.orderGroupId}` as never);
        },
        onError: (err) => {
          alert(err.message || 'Checkout failed');
        },
      }
    );
  };

  return (
    <Button
      size='lg'
      className='w-full'
      onClick={handlePlaceOrder}
      disabled={checkoutMutation.isPending}
    >
      {checkoutMutation.isPending ? (
        <>
          <Loader2 className='w-4 h-4 animate-spin mr-2' />
          Processing...
        </>
      ) : (
        `Pay $${total.toFixed(2)}`
      )}
    </Button>
  );
};

export default PlaceOrderButton;
