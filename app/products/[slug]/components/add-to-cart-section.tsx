'use client'

import { useState } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { OmittedProductFields } from '@/lib/types'

interface AddToCartSectionProps {
  product: OmittedProductFields
}

export function AddToCartSection({product}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    toast.success('Added to cart', {
      description: `${quantity} × ${product.name} added to your cart`
    })
  }

  const handleBuyNow = () => {
    toast.info('Proceeding to checkout', {
      description: `${quantity} × ${product.name}`
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Quantity Selector - REDESIGNED */}
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <label className='text-sm font-medium text-foreground'>Quantity</label>
          <span className='text-xs text-muted-foreground'>{quantity > 1 ? `${quantity} items` : '1 item'}</span>
        </div>

        <div className='flex gap-2'>
          <input
            type='number'
            min='1'
            max='999'
            value={quantity}
            onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
            className='flex-1 h-12 text-center border border-border rounded-lg bg-background text-foreground font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
          />

          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity === 1}
            className='flex items-center justify-center w-12 h-12 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-base'
            aria-label='Decrease quantity'
          >
            −
          </button>

          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className='flex items-center justify-center w-12 h-12 rounded-lg border border-border hover:bg-muted transition-colors font-semibold text-base'
            aria-label='Increase quantity'
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Button size='lg' className='flex-1 gap-2 h-12 text-base' onClick={handleAddToCart}>
          <ShoppingCart size={20} />
          Add to Cart
        </Button>
        <Button size='lg' variant='outline' className='flex-1 h-12 text-base' onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>

      {/* Wishlist Button */}
      <Button variant='outline' className='w-full gap-2 h-11' onClick={() => setIsWishlisted(!isWishlisted)}>
        <Heart size={20} className={isWishlisted ? 'fill-destructive text-destructive' : ''} />
        {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </Button>

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
