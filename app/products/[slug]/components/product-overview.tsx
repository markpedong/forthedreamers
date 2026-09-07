import {Star} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import type {ProductPageVariant, ProductPurchaseData} from './product-types'

interface ProductOverviewProps {
  product: ProductPurchaseData
  selectedVariant: ProductPageVariant | null
}

const formatPrice = (value: number) => `$${value.toFixed(2)}`

const ProductOverview = ({product, selectedVariant}: ProductOverviewProps) => {
  const currentPrice = selectedVariant?.discountedPrice ?? selectedVariant?.price ?? product.basePrice
  const originalPrice =
    selectedVariant && selectedVariant.discountedPrice !== null && selectedVariant.discountedPrice < selectedVariant.price
      ? selectedVariant.price
      : null
  const discount = originalPrice && currentPrice !== null ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0
  const rating = product.rating || 0

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground'>
        <span>{product.categoryName}</span>
        {product.brand && <span>· {product.brand}</span>}
      </div>

      <div className='space-y-3'>
        <h1 className='text-3xl font-medium leading-tight tracking-tight text-foreground lg:text-4xl'>{product.name}</h1>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm'>
          <span className='flex items-center gap-1 font-medium text-foreground'>
            <Star size={16} className={rating ? 'fill-primary text-primary' : 'text-muted-foreground'} />
            {rating ? rating.toFixed(1) : 'No rating yet'}
          </span>
          <span className='text-muted-foreground'>{product.reviewCount} reviews</span>
          <span className='text-muted-foreground'>{product.soldCount.toLocaleString()} sold</span>
        </div>
      </div>

      <div className='flex flex-wrap items-baseline gap-3 border-y border-border py-5'>
        {currentPrice !== null ? (
          <span className='text-3xl font-semibold tracking-tight text-foreground'>{formatPrice(currentPrice)}</span>
        ) : (
          <span className='text-lg font-medium text-muted-foreground'>Price unavailable</span>
        )}
        {originalPrice && <span className='text-base text-muted-foreground line-through'>{formatPrice(originalPrice)}</span>}
        {discount > 0 && <Badge variant='secondary'>{discount}% off</Badge>}
      </div>
    </div>
  )
}

export default ProductOverview
