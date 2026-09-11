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
  const hasVariantOptions =
    product.variants.length > 1 || Object.keys(product.variants[0]?.attributes ?? {}).length > 0;
  const [selectedId, setSelectedId] = useState(() =>
    hasVariantOptions ? undefined : (product.variants.find(variant => variant.stock > 0) ?? product.variants[0])?.id
  );
  const [hoveredId, setHoveredId] = useState<string>();
  const [showProductImage, setShowProductImage] = useState(false);
  const selectedVariant = product.variants.find(variant => variant.id === selectedId) ?? null;
  const productImages = hasVariantOptions
    ? product.images.filter(image => product.variants.every(variant => variant.image !== image))
    : product.images;
  const previewVariant =
    product.variants.find(variant => variant.id === hoveredId) ??
    (hasVariantOptions && !showProductImage ? selectedVariant : null);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16">
      <ProductGallery
        images={productImages}
        previewImage={previewVariant?.image}
        alt={product.name}
        onSelectImage={() => setShowProductImage(true)}
        onProductImageClick={selectedVariant && showProductImage ? () => setShowProductImage(false) : undefined}
      />
      <div className="flex flex-col">
        <ProductOverview product={product} selectedVariant={selectedVariant} />
        {hasVariantOptions && (
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
                  onClick={() => {
                    setSelectedId(current => (current === variant.id ? undefined : variant.id));
                    setShowProductImage(false);
                  }}
                  onMouseEnter={() => setHoveredId(variant.id)}
                  onMouseLeave={() => setHoveredId(undefined)}
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
