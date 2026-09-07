'use client'

import { useAppSelector } from '@/redux/store'

const CartItemCount = () => {
  const count = useAppSelector(state => state.cartData.cartCount)
  if (count === 0) return null

  return (
    <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default CartItemCount
