'use client'

import { Badge } from '@/components/ui/badge'
import { OmittedProductFields } from '@/lib/types'
import { useAppSelector } from '@/redux/store'

interface ProductOverviewProps {
  product: OmittedProductFields
}

const ProductOverview: React.FC<ProductOverviewProps> = ({product}) => {
  const selectedVariant = useAppSelector(state => state.appData.selectedVariant)
  const {name, brand, basePrice, rating, reviewCount} = product
  const price = 399
  const basePriceNum = Number(basePrice)
  const discount = basePriceNum > price ? Math.round(((basePriceNum - price) / basePriceNum) * 100) : 0
  // const fullStars = Math.floor(rating)

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col'>
        <p className='text-xs uppercase tracking-widest text-muted-foreground'>{brand}</p>
        <h1 className='text-2xl lg:text-3xl font-medium tracking-tight text-foreground leading-tight'>{name}</h1>
      </div>

      {/* <div className='flex items-center gap-3'>
        <div className='flex gap-0.5'>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < fullStars ? 'fill-foreground text-foreground' : 'text-muted-foreground'} />
          ))}
        </div>
        <span className='text-sm text-muted-foreground'>
          {rating} ({reviewCount} reviews)
        </span>
      </div> */}
      <div className='flex items-baseline gap-3'>
        <span className='text-2xl lg:text-3xl font-medium text-foreground'>
          ${' '}
          {!!selectedVariant
            ? selectedVariant?.discountedPrice
              ? selectedVariant.discountedPrice
              : selectedVariant?.price
            : price.toFixed(2)}
        </span>
        {Number(basePrice) > Number(selectedVariant?.price) && (
          <>
            <span className='text-md text-muted-foreground line-through'>${Number(basePrice).toFixed(2)}</span>
            <Badge variant='destructive' className='bg-destructive/10 text-accent-foreground hover:bg-destructive/20'>
              Save {discount}%
            </Badge>
          </>
        )}
      </div>
      {/* <div className='text-sm my-3 font-medium'>{product.description}</div> */}
    </div>
  )
}

export default ProductOverview
