'use client'

import { FC, useState } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { OmittedProductFields } from '@/lib/types'
import { useAppSelector } from '@/redux/store'

const AddToCartSection: FC<{product: OmittedProductFields}> = ({product}) => {
  const selectedVariant = useAppSelector(state => state.appData.selectedVariant)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleQuantity = (value: number) => {
    if (value > 0) setQuantity(value)
  }

  const addToCart = () =>
    toast.success('Added to cart', {
      description: `${quantity} × ${product.name} added to your cart`
    })

  const buyNow = () =>
    toast.info('Proceeding to checkout', {
      description: `${quantity} × ${product.name}`
    })

  return (
    <div className='flex flex-col gap-6 mt-8'>
      <div className='flex gap-2'>
        <input
          type='number'
          min={1}
          max={999}
          value={quantity}
          onChange={e => handleQuantity(Number(e.target.value) || 1)}
          className='flex-1 h-12 text-center border border-border rounded-lg bg-background text-foreground font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
        />

        <button
          onClick={() => handleQuantity(quantity - 1)}
          disabled={quantity === 1}
          aria-label='Decrease quantity'
          className='w-12 h-12 flex items-center justify-center rounded-lg border border-border font-semibold hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          −
        </button>

        <button
          aria-label='Increase quantity'
          onClick={() => handleQuantity(quantity + 1)}
          className='w-12 h-12 flex items-center justify-center rounded-lg border border-border font-semibold hover:bg-muted transition-colors'
        >
          +
        </button>
      </div>

      {/* Add to Cart / Buy Now */}
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Button size='lg' className='flex-1 gap-2 h-12' onClick={addToCart}>
          <ShoppingCart size={20} />
          Add to Cart
        </Button>

        <Button size='lg' variant='outline' className='flex-1 h-12' onClick={buyNow}>
          Buy Now
        </Button>
      </div>

      {/* Wishlist */}
      {selectedVariant?.stock === 0 && (
        <Button variant='outline' className='w-full gap-2 h-11' onClick={() => setIsWishlisted(prev => !prev)}>
          <Heart size={20} className={isWishlisted ? 'fill-destructive text-destructive' : ''} />
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
      )}

      {/* Trust Badges */}
      <div className='flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground'>
        <p className='flex items-center gap-2'>
          <span className='text-primary'>✓</span> Free shipping on orders over $50
        </p>
        <p className='flex items-center gap-2'>
          <span className='text-primary'>✓</span> 30-day money-back guarantee
        </p>
        <p className='flex items-center gap-2'>
          <span className='text-primary'>✓</span> 2-year warranty included
        </p>
      </div>
    </div>
  )
}

export default AddToCartSection
