'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProductPageVariant, ProductPurchaseData } from './product-types';
import { useAddCartMutation, useWishlistMutation } from '@/services/useMutation';
import { useWishlistQuery } from '@/services/useQuery';

const AddToCartSection = ({
  product,
  selectedVariant,
}: {
  product: ProductPurchaseData;
  selectedVariant: ProductPageVariant | null;
}) => {
  const wishlistQuery = useWishlistQuery();
  const wishlistMutation = useWishlistMutation();
  const [quantity, setQuantity] = useState(1);
  const wishlistIds = wishlistQuery.data ?? [];
  const isWishlisted = wishlistIds.includes(product.id);
  const router = useRouter();
  const maxQuantity = Math.min(999, selectedVariant?.stock ?? 0);
  const safeQuantity = Math.min(quantity, Math.max(1, maxQuantity));
  const cartMutation = useAddCartMutation();
  const isProcessingBuyNow = cartMutation.isPending && cartMutation.variables?.buyNow;

  const handleQuantity = (value: number) => {
    if (Number.isSafeInteger(value) && value > 0 && value <= maxQuantity) setQuantity(value);
  };

  const submit = (buyNow: boolean) => {
    if (!selectedVariant || selectedVariant.stock < 1 || cartMutation.isPending) return;
    cartMutation.mutate({ variantId: selectedVariant.id, quantity: safeQuantity, buyNow });
  };

  const handleAddToCart = () => submit(false);
  const handleBuyNow = () => submit(true);
  const prefetchCheckout = () => {
    void router.prefetch('/checkout');
  };

  return (
    <div className="mt-8 flex flex-col gap-5">
      {selectedVariant ? (
        <>
          <div className="flex max-w-xs items-center gap-2">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <button
              type="button"
              onClick={() => handleQuantity(safeQuantity - 1)}
              disabled={safeQuantity === 1 || maxQuantity === 0}
              aria-label="Decrease quantity"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-lg hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={Math.max(1, maxQuantity)}
              disabled={maxQuantity === 0}
              value={safeQuantity}
              onChange={event => handleQuantity(Number(event.target.value) || 1)}
              aria-label="Quantity"
              className="h-10 w-16 rounded-md border border-border bg-background text-center font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => handleQuantity(safeQuantity + 1)}
              disabled={safeQuantity >= maxQuantity || maxQuantity === 0}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-lg hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              +
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Add to Cart: never blocks the UI (optimistic). */}
            <Button size="lg" className="h-12 flex-1" onClick={handleAddToCart} disabled={maxQuantity === 0}>
              <ShoppingCart size={18} />
              Add to Cart
            </Button>
            {/* Buy Now: critical action — disable button and show pending feedback (AGENTS.md). */}
            <Button
              size="lg"
              variant="outline"
              className="h-12 flex-1"
              onClick={handleBuyNow}
              onMouseEnter={prefetchCheckout}
              onFocus={prefetchCheckout}
              disabled={maxQuantity === 0 || isProcessingBuyNow}
            >
              {isProcessingBuyNow ? 'Preparing checkout...' : 'Buy Now'}
            </Button>
          </div>
        </>
      ) : (
        <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          This product is unavailable for purchase.
        </p>
      )}

      <Button
        variant="outline"
        className="h-11 w-full"
        disabled={wishlistMutation.isPending && wishlistMutation.variables?.id === product.id}
        onClick={() => wishlistMutation.mutate({ id: product.id, wanted: !isWishlisted })}
        aria-pressed={isWishlisted}
      >
        <Heart size={18} className={isWishlisted ? 'fill-destructive text-destructive' : ''} />
        {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </Button>
    </div>
  );
};

export default AddToCartSection;
