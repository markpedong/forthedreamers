'use client'

import {toggleWishlist} from '@/lib/store'
import {useAppDispatch, useAppSelector} from './use-app-store'

export const useWishlist = () => {
  const dispatch = useAppDispatch()
  const ids = useAppSelector(state => state.app.wishlistIds)
  const pendingIds = useAppSelector(state => state.app.pendingWishlistIds)

  return {
    ids,
    pending: pendingIds.length > 0,
    isPending: (id: string) => pendingIds.includes(id),
    toggle: (id: string) => {
      void dispatch(toggleWishlist({id, wanted: !ids.includes(id)}))
    }
  }
}
