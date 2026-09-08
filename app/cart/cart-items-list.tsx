'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { removeCartItem, updateCartQuantity } from '@/lib/http';
import type { CartItem } from '@/lib/services/cart';
import CartNavigation from './cart-navigation';
import { useMutation } from '@tanstack/react-query';

const CartItemsList = ({ items }: { items: CartItem[] }) => {
  const [visibleItems, setVisibleItems] = useState(items);
  const confirmedItems = useRef(new Map<string, CartItem | null>(items.map(item => [item.id, item])));
  const versions = useRef(new Map<string, number>());
  const queues = useRef(new Map<string, Promise<void>>());
  const quantityTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const updateMutation = useMutation({ mutationFn: updateCartQuantity });
  const removeMutation = useMutation({ mutationFn: removeCartItem });

  useEffect(
    () => () => {
      quantityTimers.current.forEach(timer => clearTimeout(timer));
    },
    []
  );

  const reconcileItem = (id: string, item: CartItem | null) => {
    setVisibleItems(state =>
      item ? state.map(value => (value.id === id ? item : value)) : state.filter(value => value.id !== id)
    );
  };

  const applyOptimisticChange = (id: string, quantity?: number) => {
    setVisibleItems(state =>
      quantity === undefined
        ? state.filter(item => item.id !== id)
        : state.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const restoreItem = (id: string) => {
    const item = confirmedItems.current.get(id);
    if (!item) {
      reconcileItem(id, null);
      return;
    }

    setVisibleItems(state => {
      const exists = state.some(value => value.id === id);
      return exists ? state.map(value => (value.id === id ? item : value)) : [...state, item];
    });
  };

  const change = (id: string, quantity?: number) => {
    const version = (versions.current.get(id) ?? 0) + 1;
    versions.current.set(id, version);
    applyOptimisticChange(id, quantity);

    const pendingTimer = quantityTimers.current.get(id);
    if (pendingTimer) clearTimeout(pendingTimer);

    if (quantity !== undefined) {
      const timer = setTimeout(() => {
        quantityTimers.current.delete(id);
        persistChange(id, quantity, version);
      }, 400);
      quantityTimers.current.set(id, timer);
      return;
    }

    quantityTimers.current.delete(id);
    persistChange(id, quantity, version);
  };

  const persistChange = (id: string, quantity: number | undefined, version: number) => {
    const previous = queues.current.get(id) ?? Promise.resolve();
    const request = previous
      .catch(() => undefined)
      .then(async () => {
        try {
          const result =
            quantity === undefined
              ? await removeMutation.mutateAsync(id)
              : await updateMutation.mutateAsync({ cartItemId: id, quantity });

          if (!result.success || !result.data) {
            if (versions.current.get(id) === version) restoreItem(id);
            toast.error(result.message);
            return;
          }

          confirmedItems.current.set(id, result.data.item);
          if (versions.current.get(id) === version) reconcileItem(id, result.data.item);
          if (quantity === undefined) toast.success(result.message);
        } catch {
          if (versions.current.get(id) === version) restoreItem(id);
          toast.error('Unable to update cart. Please try again.');
        }
      });

    queues.current.set(id, request);
    request.then(() => {
      if (queues.current.get(id) === request) queues.current.delete(id);
    });
  };

  const handleRemove = (id: string) => change(id);
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity >= 1) change(id, quantity);
  };

  const total = visibleItems.reduce(
    (sum, item) => sum + (item.variant.discountedPrice ?? item.variant.price) * item.quantity,
    0
  );
  if (!visibleItems.length)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-6">Your cart is empty</h2>
        <Link href="/">Continue Shopping</Link>
      </div>
    );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {visibleItems.map(item => {
          const price = item.variant.discountedPrice ?? item.variant.price;
          const itemTotal = price * item.quantity;

          return (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card">
              {item.variant.image && (
                <Image
                  src={item.variant.image}
                  alt={item.variant.product.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
              )}
              <div className="flex-1">
                <Link
                  href={`/products/${item.variant.product.slug}` as never}
                  className="font-semibold hover:underline"
                >
                  {item.variant.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">{item.variant.name}</p>
                {item.variant.discountedPrice && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-primary">${item.variant.discountedPrice.toFixed(2)}</span>
                    <span className="line-through text-muted-foreground text-sm">${item.variant.price.toFixed(2)}</span>
                  </div>
                )}
                {!item.variant.discountedPrice && <p className="font-bold text-primary mt-1">${price.toFixed(2)}</p>}
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1 border rounded hover:bg-muted"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1 border rounded hover:bg-muted"
                    disabled={item.quantity >= item.variant.stock}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="font-semibold">${itemTotal.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="order-first lg:order-last">
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <CartNavigation />
        </div>
      </div>
    </div>
  );
};

export default CartItemsList;
