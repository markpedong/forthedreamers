'use client'

import {useMemo, useState} from 'react'
import ProductGallery from './product-gallery'
import ProductOverview from './product-overview'
import VariantSelector from './variant-selector'
import AddToCartSection from './add-to-cart-section'
import {TVariant} from '@/lib/types'

interface ProductPageClientProps {
  product: {
    id: string
    name: string
    brand: string | null
    basePrice: number | null
    images: string[]
    variants: Array<{name: string; id: string; stock: number; price: number; discountedPrice?: number | null; coupon?: string | null; image?: string | null; attributes: unknown}>
  }
}

const ProductPageClient = ({product}: ProductPageClientProps) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

  // Compute attribute types from variants
  const attributeTypes = useMemo(() => {
    if (!product.variants) return [] as string[]
    return Array.from(new Set((product.variants as TVariant[]).flatMap(v => Object.keys(v.attributes))))
  }, [product.variants])

  // Compute selected variant from attributes
  const selectedVariant = useMemo(() => {
    if (attributeTypes.length === 0) return null as TVariant | null
    const variants = product.variants as TVariant[]
    return variants.find(v => attributeTypes.every(type => v.attributes[type] === selectedAttributes[type])) || null
  }, [product.variants, attributeTypes, selectedAttributes])

  return (
    <>
      <div className='mx-auto max-w-7xl pt-16 px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2'>
        <ProductGallery images={product.images} />
        <div className='flex flex-col'>
          <ProductOverview product={product} selectedVariant={selectedVariant as TVariant | null} />
          <VariantSelector
            variants={product.variants as TVariant[]}
            attributeTypes={attributeTypes}
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
          />
          <AddToCartSection product={product} selectedVariant={selectedVariant as TVariant | null} />
        </div>
      </div>
    </>
  )
}

export default ProductPageClient
