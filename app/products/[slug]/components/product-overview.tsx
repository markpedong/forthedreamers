'use client'

import { Badge } from '@/components/ui/badge'
import { OmittedProductFields } from '@/lib/types'
import { useAppSelector } from '@/redux/store'
import { Star } from 'lucide-react'

interface ProductOverviewProps {
  product: OmittedProductFields
}

const ProductOverview: React.FC<ProductOverviewProps> = ({product}) => {
  const selectedVariant = useAppSelector(state => state.appData.selectedVariant)
  const {name, brand, basePrice, rating, reviewCount} = product
  const price = 399
  const basePriceNum = Number(basePrice)
  const discount = basePriceNum > price ? Math.round(((basePriceNum - price) / basePriceNum) * 100) : 0
  const fullStars = Math.floor(rating)

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <p className='text-xs uppercase tracking-widest text-muted-foreground'>{brand}</p>
        <h1 className='text-4xl lg:text-5xl font-light tracking-tight text-foreground leading-tight'>{name}</h1>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex gap-0.5'>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < fullStars ? 'fill-foreground text-foreground' : 'text-muted-foreground'} />
          ))}
        </div>
        <span className='text-sm text-muted-foreground'>
          {rating} ({reviewCount} reviews)
        </span>
      </div>

      <div className='flex items-baseline gap-4'>
        <span className='text-3xl font-light text-foreground'>
          $
          {!!selectedVariant
            ? selectedVariant?.discountedPrice
              ? selectedVariant.discountedPrice
              : selectedVariant?.price
            : price.toFixed(2)}
        </span>
        {discount > 0 && (
          <>
            <span className='text-lg text-muted-foreground line-through'>${basePriceNum.toFixed(2)}</span>
            <Badge variant='secondary' className='bg-accent/10 text-accent hover:bg-accent/20'>
              Save {discount}%
            </Badge>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductOverview
