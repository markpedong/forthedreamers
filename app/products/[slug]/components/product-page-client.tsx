'use client'

import {useMemo, useState} from 'react'
import ProductOverview from './product-overview'
import VariantSelector from './variant-selector'
import AddToCartSection from './add-to-cart-section'
import type {ProductPurchaseData} from './product-types'

interface ProductPageClientProps {
  product: ProductPurchaseData
}

const ProductPageClient = ({product}: ProductPageClientProps) => {
  const attributeTypes = useMemo(() => Array.from(new Set(product.variants.flatMap(variant => Object.keys(variant.attributes)))), [product.variants])
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => product.variants[0]?.attributes ?? {})

  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null
    if (attributeTypes.length === 0) return product.variants[0]
    return product.variants.find(variant => attributeTypes.every(type => variant.attributes[type] === selectedAttributes[type])) ?? null
  }, [product.variants, attributeTypes, selectedAttributes])

  return (
    <div className='flex flex-col'>
      <ProductOverview product={product} selectedVariant={selectedVariant} />
      <VariantSelector
        variants={product.variants}
        attributeTypes={attributeTypes}
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
      />
      <AddToCartSection product={product} selectedVariant={selectedVariant} />
    </div>
  )
}

export default ProductPageClient
