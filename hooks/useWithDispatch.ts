import { setCartOpen } from '@/redux/slices/appSlice'
import { setCartItems } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { getCartItems } from '@/utils/request'
import { useSession } from 'next-auth/react'

export const useWithDispatch = () => {
  const isCartOpen = useAppSelector(state => state.app.isCartOpen)
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const fetchCartItem = async () => {
    const cart = await getCartItems(session?.user.id)

    if (cart.data.length === 0) {
      isCartOpen && dispatch(setCartOpen(false))
    }

    dispatch(setCartItems(cart.data))
  }

  return {
    fetchCartItem
  }
}
