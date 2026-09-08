'use client';

import { FC } from 'react';
import {checkoutCart} from '@/lib/http';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {useMutation} from '@tanstack/react-query';

interface PlaceOrderButtonProps {
  total: number;
}

const PlaceOrderButton: FC<PlaceOrderButtonProps> = ({ total }) => {
  const mutation = useMutation({
    mutationFn: checkoutCart,
    onSuccess: result => {
      if (result.data) window.location.assign(`/checkout/success?orderId=${result.data.orderGroupId}`)
    },
    onError: error => toast.error(error.message)
  })
  const pending = mutation.isPending
  const handlePlaceOrder = () => mutation.mutate()

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
  )
}

export default PlaceOrderButton;
