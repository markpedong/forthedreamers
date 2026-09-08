'use client';

import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCheckoutMutation } from '@/services/useMutation';

interface PlaceOrderButtonProps {
  total: number;
}

const PlaceOrderButton: FC<PlaceOrderButtonProps> = ({ total }) => {
  const mutation = useCheckoutMutation();
  const pending = mutation.isPending;
  const handlePlaceOrder = () => mutation.mutate();

  return (
    <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Processing...
        </>
      ) : (
        `Pay $${total.toFixed(2)}`
      )}
    </Button>
  );
};

export default PlaceOrderButton;
