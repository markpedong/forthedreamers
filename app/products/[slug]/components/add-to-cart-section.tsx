'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Heart, ShoppingCart} from 'lucide-react'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button'
import {useCartCount} from '@/components/provider/cart-count-provider'
import {useWishlist} from '@/components/provider/wishlist-provider'
import {addToCart} from '@/lib/actions/cart'
import type {ProductPageVariant, ProductPurchaseData} from './product-types'

const AddToCartSection = ({product, selectedVariant}: {product: ProductPurchaseData; selectedVariant: ProductPageVariant | null}) => {
  const [quantity, setQuantity] = useState(1)
  const wishlist = useWishlist()
  const isWishlisted = wishlist.ids.includes(product.id)
  const [pendingAction, setPendingAction] = useState<'add' | 'buy' | null>(null)
  const {count, setCount} = useCartCount()
  const router = useRouter()
  const maxQuantity = Math.min(999, selectedVariant?.stock ?? 0)
  const safeQuantity = Math.min(quantity, Math.max(1, maxQuantity))

  const handleQuantity = (value: number) => {
    if (Number.isSafeInteger(value) && value > 0 && value <= maxQuantity) setQuantity(value)
  }

  const submit = (buyNow: boolean) => {
    if (!selectedVariant || selectedVariant.stock < 1 || pendingAction) return

    const action = buyNow ? 'buy' : 'add'
    const canOptimisticallyAddBadge = count === 0
    setPendingAction(action)
    if (canOptimisticallyAddBadge) setCount(value => value + 1)

    void (async () => {
      try {
        const result = await addToCart(selectedVariant.id, safeQuantity)
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
    <div className='mt-8 flex flex-col gap-5'>
      {selectedVariant ? (
        <>
          <div className='flex max-w-xs items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Quantity</span>
            <button
              type='button'
              onClick={() => handleQuantity(safeQuantity - 1)}
              disabled={safeQuantity === 1 || maxQuantity === 0}
              aria-label='Decrease quantity'
              className='flex h-10 w-10 items-center justify-center rounded-md border border-border text-lg hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
            >
              −
            </button>
            <input
              type='number'
              min={1}
              max={maxQuantity}
              value={safeQuantity}
              onChange={event => handleQuantity(Number(event.target.value) || 1)}
              aria-label='Quantity'
              className='h-10 w-16 rounded-md border border-border bg-background text-center font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
            />
            <button
              type='button'
              aria-label='Increase quantity'
              onClick={() => handleQuantity(safeQuantity + 1)}
              disabled={safeQuantity >= maxQuantity || maxQuantity === 0}
              className='flex h-10 w-10 items-center justify-center rounded-md border border-border text-lg hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50'
            >
              +
            </button>
          </div>

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button size='lg' className='h-12 flex-1' onClick={handleAddToCart} disabled={pendingAction !== null || maxQuantity === 0}>
              <ShoppingCart size={18} />
              {pendingAction === 'add' ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='h-12 flex-1'
              onClick={handleBuyNow}
              onMouseEnter={prefetchCheckout}
              onFocus={prefetchCheckout}
              disabled={pendingAction !== null || maxQuantity === 0}
            >
              {pendingAction === 'buy' ? 'Preparing checkout...' : 'Buy Now'}
            </Button>
          </div>
        </>
      ) : (
        <p className='rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground'>This product is unavailable for purchase.</p>
      )}

      <Button
        variant='outline'
        className='h-11 w-full'
        disabled={wishlist.isPending(product.id)}
        onClick={() => wishlist.toggle(product.id)}
        aria-pressed={isWishlisted}
      >
        <Heart size={18} className={isWishlisted ? 'fill-destructive text-destructive' : ''} />
        {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </Button>
    </div>
  )
}

export default AddToCartSection
