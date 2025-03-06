'use client'

import ProductImages from '@/components/product-details/product-images'
import QuantitySelector from '@/components/product-details/quantity-selector'
import VariationSelector from '@/components/product-details/variantion-selector'
import { TProductItem } from '@/constants/types'
import { Button, Divider, Spinner } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Variations } from '@prisma/client'
import { FC, Suspense, useEffect, useState } from 'react'

type Props = {
  product: TProductItem
}

const ProductPage: FC<Props> = ({ product }) => {
  const [selectedVariation, setSelectedVariation] = useState<Variations | null>(null)
  const [quantity, setQuantity] = useState(1)
  const currentPrice = selectedVariation?.discountedPrice || selectedVariation?.price || 0
  const hasDiscount = selectedVariation?.discountedPrice && selectedVariation.discountedPrice < selectedVariation.price
  const isOutOfStock = selectedVariation ? selectedVariation.stock <= 0 : true

  useEffect(() => {
    if (product && product.variations.length > 0 && !selectedVariation) {
      const firstAvailable = product.variations.find(v => v.stock > 0) || product.variations[0]
      setSelectedVariation(firstAvailable)
    }
  }, [product, selectedVariation])

  const handleAddToCart = () => {
    if (!selectedVariation) return

    const cartItem = {
      productId: product?.id,
      variationId: selectedVariation.id,
      quantity,
      price: selectedVariation.discountedPrice || selectedVariation.price
    }

    console.log('Adding to cart:', cartItem)
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductImages images={product.images} />
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {selectedVariation && (
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-semibold">${currentPrice.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-sm text-default-500 line-through">${selectedVariation.price.toFixed(2)}</span>
                )}
              </div>
            )}
            {product.description && <p className="text-default-700">{product.description}</p>}
            <Divider />
            <VariationSelector
              variations={product.variations}
              selectedVariation={selectedVariation}
              onVariationChange={setSelectedVariation}
            />
            <Divider />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantity</span>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  maxQuantity={selectedVariation ? selectedVariation.stock : 0}
                />
              </div>
              <Button
                color="primary"
                size="lg"
                startContent={<Icon icon="lucide:shopping-cart" />}
                onPress={handleAddToCart}
                isDisabled={isOutOfStock || !selectedVariation}
                fullWidth
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default ProductPage
