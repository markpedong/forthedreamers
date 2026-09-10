'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AddToCartSection from './add-to-cart-section';
import ProductGallery from './product-gallery';
import ProductOverview from './product-overview';
import type { ProductPurchaseData } from './product-types';

interface ProductPageClientProps {
  product: ProductPurchaseData;
}

const ProductPageClient = ({ product }: ProductPageClientProps) => {
  const [selectedId, setSelectedId] = useState(
    () => (product.variants.find(variant => variant.stock > 0) ?? product.variants[0])?.id
  );
  const selectedVariant = product.variants.find(variant => variant.id === selectedId) ?? null;
  const images = selectedVariant?.image
    ? [selectedVariant.image, ...product.images.filter(image => image !== selectedVariant.image)]
    : product.images;

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16">
      <ProductGallery key={selectedVariant?.id ?? 'product'} images={images} alt={product.name} />
      <div className="flex flex-col">
        <ProductOverview product={product} selectedVariant={selectedVariant} />
        {(product.variants.length > 1 || Object.keys(product.variants[0]?.attributes ?? {}).length > 0) && (
          <fieldset className="mt-6 space-y-3">
            <legend className="text-sm font-medium">Choose an option</legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(variant => (
                <Button
                  key={variant.id}
                  type="button"
                  variant={selectedId === variant.id ? 'default' : 'outline'}
                  className="h-auto whitespace-normal py-3 text-left"
                  aria-pressed={selectedId === variant.id}
                  onClick={() => setSelectedId(variant.id)}
                >
                  {variant.name}
                  {Object.keys(variant.attributes).length > 0 &&
                    ` · ${Object.entries(variant.attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}`}
                  {variant.stock < 1 && ' · Out of stock'}
                </Button>
              ))}
            </div>
            <p role="status" className="text-sm text-muted-foreground">
              {selectedVariant
                ? selectedVariant.stock > 0
                  ? `${selectedVariant.stock} available`
                  : 'Out of stock'
                : 'Choose an option'}
            </p>
          </fieldset>
        )}
        <AddToCartSection product={product} selectedVariant={selectedVariant} />
      </div>
    </section>
  );
};

export default ProductPageClient;
