'use client';

import { FC, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCheckoutMutation } from '@/services/useMutation';

interface PlaceOrderButtonProps {
  total: number;
  shippingMethodsCount: number;
}

const PlaceOrderButton: FC<PlaceOrderButtonProps> = ({ total, shippingMethodsCount }) => {
  const mutation = useCheckoutMutation();
  const pending = mutation.isPending;

  const handlePlaceOrder = () => {
    const selectedRadio = document.querySelector('input[name="shippingMethod"]:checked') as HTMLInputElement | null;
    if (!selectedRadio || shippingMethodsCount === 0) {
      alert('Please select a shipping method before placing your order.');
      return;
    }
    mutation.mutate({ shippingMethodId: selectedRadio.value });
  };

  return (
    <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Processing...
        </>
      ) : (
        'Place Order'
      )}
    </Button>
  );
};

export default PlaceOrderButton;
