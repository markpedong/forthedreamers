'use client'

import {FC, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Heart, ShoppingCart} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useCartCount} from '@/components/provider/cart-count-provider'
import {useWishlist} from '@/components/provider/wishlist-provider'
import {addToCart} from '@/lib/actions/cart'
import {OmittedProductFields, TVariant} from '@/lib/types'
import {toast} from 'sonner'

const AddToCartSection: FC<{product: Pick<OmittedProductFields, 'id'>; selectedVariant?: TVariant | null}> = ({product, selectedVariant}) => {
  const [quantity, setQuantity] = useState(1)
  const wishlist = useWishlist()
  const isWishlisted = wishlist.ids.includes(product.id)
  const [pendingAction, setPendingAction] = useState<'add' | 'buy' | null>(null)
  const {count, setCount} = useCartCount()
  const router = useRouter()
  const handleQuantity = (value: number) => {
    if (Number.isSafeInteger(value) && value > 0 && value <= Math.min(999, selectedVariant?.stock ?? 999)) setQuantity(value)
  }
  const submit = (buyNow: boolean) => {
    if (!selectedVariant || pendingAction) return

    const action = buyNow ? 'buy' : 'add'
    const canOptimisticallyAddBadge = count === 0
    setPendingAction(action)
    if (canOptimisticallyAddBadge) setCount(value => value + 1)

    void (async () => {
      try {
        const result = await addToCart(selectedVariant.id, quantity)
        if (!result.success) {
          if (canOptimisticallyAddBadge) setCount(value => Math.max(0, value - 1))
          toast.error(result.message)
          return
        }

        setCount(result.data.count)
        toast.success(result.message)
        if (buyNow) router.push('/checkout')
      } catch {
        if (canOptimisticallyAddBadge) setCount(value => Math.max(0, value - 1))
        toast.error('Unable to add to cart. Please try again.')
      } finally {
        setPendingAction(null)
      }
    })()
  }
  const handleAddToCart = () => submit(false)
  const handleBuyNow = () => submit(true)
  const prefetchCheckout = () => {
    void router.prefetch('/checkout')
  }

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
        <Button size='lg' className='flex-1 gap-2 h-12' onClick={handleAddToCart} disabled={pendingAction !== null}>
          <ShoppingCart size={20} />
          {pendingAction === 'add' ? 'Adding...' : 'Add to Cart'}
        </Button>

        <Button
          size='lg'
          variant='outline'
          className='flex-1 h-12'
          onClick={handleBuyNow}
          onMouseEnter={prefetchCheckout}
          onFocus={prefetchCheckout}
          disabled={pendingAction !== null}
        >
          {pendingAction === 'buy' ? 'Preparing checkout...' : 'Buy Now'}
        </Button>
      </div>

      {/* Wishlist */}
      {selectedVariant?.stock === 0 && (
        <Button variant='outline' className='w-full gap-2 h-11' disabled={wishlist.isPending(product.id)} onClick={() => wishlist.toggle(product.id)}>
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
