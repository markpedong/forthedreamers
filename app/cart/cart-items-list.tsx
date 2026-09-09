'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Store } from 'lucide-react';
import { toast } from 'sonner';
import type { CartItem } from '@/lib/services/cart';
import CartNavigation from './cart-navigation';
import { useRemoveCartMutation, useUpdateCartMutation } from '@/services/useMutation';

const getStoreName = (sellerId: string): string => `Store ${sellerId.slice(0, 4)}`;

const CartItemsList = ({ items }: { items: CartItem[] }) => {
  const [visibleItems, setVisibleItems] = useState(items);
  // item id → selected state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map(i => i.id)));
  const confirmedItems = useRef(new Map<string, CartItem | null>(items.map(item => [item.id, item])));
  const versions = useRef(new Map<string, number>());
  const queues = useRef(new Map<string, Promise<void>>());
  const quantityTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const updateMutation = useUpdateCartMutation();
  const removeMutation = useRemoveCartMutation();

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

  const change = (id: string) => {
    const version = (versions.current.get(id) ?? 0) + 1;
    versions.current.set(id, version);

    const pendingTimer = quantityTimers.current.get(id);
    if (pendingTimer) clearTimeout(pendingTimer);

    const timer = setTimeout(() => {
      quantityTimers.current.delete(id);
      persistChange(id, version);
    }, 400);
    quantityTimers.current.set(id, timer);
  };

  const persistChange = (id: string, version: number) => {
    const previous = queues.current.get(id) ?? Promise.resolve();
    const request = previous
      .catch(() => undefined)
      .then(async () => {
        try {
          const result = await removeMutation.mutateAsync(id);

          if (!result.success || !result.data) {
            if (versions.current.get(id) === version) restoreItem(id);
            toast.error(result.message);
            return;
          }

          confirmedItems.current.set(id, null);
          if (versions.current.get(id) === version) {
            reconcileItem(id, null);
            setSelectedItems(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          } else {
            toast.success(result.message);
          }
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

  // Quantity change for existing items
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity >= 1) {
      const version = (versions.current.get(id) ?? 0) + 1;
      versions.current.set(id, version);
      applyOptimisticChange(id, quantity);

      const pendingTimer = quantityTimers.current.get(id);
      if (pendingTimer) clearTimeout(pendingTimer);

      const timer = setTimeout(() => {
        quantityTimers.current.delete(id);
        persistQuantityChange(id, quantity, version);
      }, 400);
      quantityTimers.current.set(id, timer);
    }
  };

  const persistQuantityChange = (id: string, quantity: number, version: number) => {
    const previous = queues.current.get(id) ?? Promise.resolve();
    const request = previous
      .catch(() => undefined)
      .then(async () => {
        try {
          const result = await updateMutation.mutateAsync({ cartItemId: id, quantity });

          if (!result.success || !result.data) {
            if (versions.current.get(id) === version) restoreItem(id);
            toast.error(result.message);
            return;
          }

          confirmedItems.current.set(id, result.data.item);
          if (versions.current.get(id) === version) reconcileItem(id, result.data.item);
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

  // Group items by sellerId
  const grouped = new Map<string, typeof visibleItems>();
  for (const item of visibleItems) {
    const sellerId = item.variant.product.sellerId;
    if (!grouped.has(sellerId)) grouped.set(sellerId, []);
    grouped.get(sellerId)!.push(item);
  }

  // Check if all items in a seller group are selected
  const isGroupSelected = (sellerId: string) => {
    const group = grouped.get(sellerId);
    return group != null && group.length > 0 && group.every(i => selectedItems.has(i.id));
  };

  // Check if some items in a group are selected (indeterminate)
  const isGroupPartiallySelected = (sellerId: string) => {
    const group = grouped.get(sellerId);
    if (!group || group.length === 0) return false;
    const count = group.filter(i => selectedItems.has(i.id)).length;
    return count > 0 && count < group.length;
  };

  const toggleGroupSelection = (sellerId: string) => {
    setSelectedItems(prev => {
      const group = grouped.get(sellerId);
      if (!group) return prev;
      const next = new Set(prev);
      const allSelected = group.every(i => prev.has(i.id));
      for (const item of group) {
        if (allSelected) next.delete(item.id);
        else next.add(item.id);
      }
      return next;
    });
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedTotal = visibleItems
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + (item.variant.discountedPrice ?? item.variant.price) * item.quantity, 0);

  if (!visibleItems.length)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-6">Your cart is empty</h2>
        <Link href="/">Continue Shopping</Link>
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {[...grouped.entries()].map(([sellerId, sellerItems]) => (
          <div key={sellerId} className="border rounded-lg bg-card overflow-hidden">
            {/* Seller header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
              <input
                type="checkbox"
                checked={isGroupSelected(sellerId)}
                ref={el => {
                  if (el) el.indeterminate = isGroupPartiallySelected(sellerId);
                }}
                onChange={() => toggleGroupSelection(sellerId)}
                className="h-4 w-4 rounded border-border"
                aria-label={`Select all from ${getStoreName(sellerId)}`}
              />
              <Store className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-sm">{getStoreName(sellerId)}</span>
              <span className="text-xs text-muted-foreground">
                ({sellerItems.length} item{sellerItems.length > 1 ? 's' : ''})
              </span>
            </div>

            {/* Items */}
            <div className="divide-y">
              {sellerItems.map(item => {
                const price = item.variant.discountedPrice ?? item.variant.price;
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.id} className="flex gap-4 p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="h-4 w-4 rounded border-border mt-1"
                      aria-label={`Select ${item.variant.product.name}`}
                    />

                    {item.variant.product.images[0] && (
                      <Image
                        src={item.variant.product.images[0]}
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
                          <span className="line-through text-muted-foreground text-sm">
                            ${item.variant.price.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {!item.variant.discountedPrice && (
                        <p className="font-bold text-primary mt-1">${price.toFixed(2)}</p>
                      )}
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
          </div>
        ))}
      </div>

      <div className="order-first lg:order-last">
        <div className="p-6 border rounded-lg bg-card space-y-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Selected items</span>
              <span>
                {selectedItems.size} of {visibleItems.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${selectedTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${selectedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Select all / none */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedItems(new Set(visibleItems.map(i => i.id)))}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Select All
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => setSelectedItems(new Set())}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Deselect All
            </button>
          </div>

          <CartNavigation selectedIds={Array.from(selectedItems)} />
        </div>
      </div>
    </div>
  );
};

export default CartItemsList;
