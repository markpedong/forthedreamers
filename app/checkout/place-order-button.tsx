'use client';

import { FC, useTransition } from 'react';
import { startCheckout } from '@/lib/actions/checkout';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceOrderButtonProps {
  total: number;
}

const PlaceOrderButton: FC<PlaceOrderButtonProps> = ({ total }) => {
  const [pending, startTransition] = useTransition();
  const handlePlaceOrder = () => startTransition(async () => {
    try {
      const result = await startCheckout();
      if (!result.success) { toast.error(result.message); return; }
      window.location.assign(result.data.url);
    } catch { toast.error('Unable to start payment'); }
  });

  return (
    <Button
      size='lg'
      className='w-full'
      onClick={handlePlaceOrder}
      disabled={pending}
    >
      {pending ? (
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
