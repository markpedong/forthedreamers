import { getCartItems } from '@/lib/server'
import { setCartItems } from '@/redux/slices/userSlice'
import { useAppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'

export const useWithDispatch = () => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const fetchCartItem = async () => {
    const cart = await getCartItems(session?.user.id)

    dispatch(setCartItems(cart))
  }

  return {
    fetchCartItem
  }
}
