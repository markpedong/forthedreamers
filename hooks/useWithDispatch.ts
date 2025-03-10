import { getCartItems, removeItemFromCart } from '@/lib/server'
import { setCartItems } from '@/redux/slices/userSlice'
import { useAppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const useWithDispatch = () => {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const fetchCartItem = async () => {
    const cart = await getCartItems(session?.user.id)

    dispatch(setCartItems(cart))
  }

  const removeCartItem = async (id: string) => {
    await removeItemFromCart(id)

    fetchCartItem()
    router.refresh()
  }
  return {
    fetchCartItem,
    removeCartItem
  }
}
