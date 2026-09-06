'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCartItems, useRemoveCartItem, useUpdateCartQuantity } from '@/lib/hooks/use-cart';

interface CartItemWithRelations {
  id: string;
  userId: string;
  variantId: string;
  productId?: string | null;
  quantity: number;
  variant: {
    id: string;
    name: string;
    price: number;
    discountedPrice?: number | null;
    stock: number;
    image?: string | null;
    product: {
      id: string;
      name: string;
      slug: string;
      seller: { storeName: string };
    };
  };
  product?: { name: string } | null;
}

interface CartItemsListProps {
  items: CartItemWithRelations[];
}

const CartItemsList: FC<CartItemsListProps> = ({ items }) => {
  const { data: cartData } = useCartItems();
  const removeMutation = useRemoveCartItem();
  const updateMutation = useUpdateCartQuantity();

  const handleRemove = (cartItemId: string) => {
    removeMutation.mutate(cartItemId);
  };

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ cartItemId, quantity: newQuantity });
  };

  return (
    <>
      {items.map((item) => {
        const price = item.variant.discountedPrice ?? item.variant.price;
        const itemTotal = price * item.quantity;

        return (
          <div
            key={item.id}
            className='flex gap-4 p-4 border rounded-lg bg-card'
          >
            {item.variant.image && (
              <Image
                src={item.variant.image}
                alt={item.variant.product.name}
                width={80}
                height={80}
                className='rounded object-cover'
              />
            )}
            <div className='flex-1'>
              <Link
                href={`/products/${item.variant.product.slug}` as never}
                className='font-semibold hover:underline'
              >
                {item.variant.product.name}
              </Link>
              <p className='text-sm text-muted-foreground'>
                {item.variant.name}
              </p>
              {item.variant.discountedPrice && (
                <div className='flex items-center gap-2 mt-1'>
                  <span className='font-bold text-primary'>
                    ${item.variant.discountedPrice.toFixed(2)}
                  </span>
                  <span className='line-through text-muted-foreground text-sm'>
                    ${item.variant.price.toFixed(2)}
                  </span>
                </div>
              )}
              {!item.variant.discountedPrice && (
                <p className='font-bold text-primary mt-1'>
                  ${price.toFixed(2)}
                </p>
              )}
            </div>

            <div className='flex flex-col items-end gap-2'>
              <button
                onClick={() => handleRemove(item.id)}
                disabled={removeMutation.isPending}
                className='p-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50'
                aria-label='Remove item'
              >
                <Trash2 className='w-4 h-4' />
              </button>

              <div className='flex items-center gap-1'>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className='p-1 border rounded hover:bg-muted'
                  disabled={item.quantity <= 1 || updateMutation.isPending}
                >
                  <Minus className='w-3 h-3' />
                </button>
                <span className='w-8 text-center'>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className='p-1 border rounded hover:bg-muted'
                  disabled={
                    item.quantity >= item.variant.stock || updateMutation.isPending
                  }
                >
                  <Plus className='w-3 h-3' />
                </button>
              </div>
              <p className='font-semibold'>
                ${itemTotal.toFixed(2)}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CartItemsList;
