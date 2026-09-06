import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useCartItems = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (!data.success) return [];
      return data.data;
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const res = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
