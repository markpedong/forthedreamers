'use client'

import {createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction} from 'react'
import {useAuthSession} from '@/lib/supabase/auth-context'

type CartCountContextValue = {
  count: number
  setCount: Dispatch<SetStateAction<number>>
}

const CartCountContext = createContext<CartCountContextValue>({count: 0, setCount: () => undefined})

export const CartCountProvider = ({initialCount, children}: {initialCount: number; children: ReactNode}) => {
  const [count, setCount] = useState(initialCount)
  const {session} = useAuthSession()
  const userId = session?.user?.id

  useEffect(() => {
    let cancelled = false

    if (!userId) {
      const resetTimer = setTimeout(() => setCount(0), 0)
      return () => {
        cancelled = true
        clearTimeout(resetTimer)
      }
    }

    const loadCount = async () => {
      try {
        const response = await fetch('/api/cart?summary=count', {cache: 'no-store'})
        const result = await response.json() as {success?: boolean; data?: {count?: number}}
        if (!cancelled && result.success && typeof result.data?.count === 'number') setCount(result.data.count)
      } catch {
        // The badge can remain at its current value when the bootstrap request is unavailable.
      }
    }

    void loadCount()
    return () => {
      cancelled = true
    }
  }, [userId])

  return <CartCountContext.Provider value={{count, setCount}}>{children}</CartCountContext.Provider>
}

export const useCartCount = () => useContext(CartCountContext)
