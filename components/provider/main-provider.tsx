'use client'

import {Suspense, useEffect, useState, type PropsWithChildren} from 'react'
import {AppProgressProvider} from '@bprogress/next'
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'
import {Provider as ReduxProvider} from 'react-redux'
import {persistStore} from 'redux-persist'
import BottomNav from '../navigation/bottom-nav'
import Footer from '../navigation/footer'
import Navbar from '../navigation/navbar'
import {Toaster} from '../ui/sonner'
import ImpersonationIndicator from './impersonation-indicator'
import ThemeToggleButton from './theme-toggle'
import ToastListener from './toast-listener'
import {getCartCount, getWishlistIds} from '@/lib/http'
import {useAppDispatch, useAppSelector} from '@/lib/hooks/use-app-store'
import {
  makeStore,
  resetAccountState,
  setCartCount,
  setResolvedTheme,
  setWishlistIds
} from '@/lib/store'
import {AuthProvider, type AuthSession, useAuthSession} from '@/lib/supabase/auth-context'

type MainProviderProps = PropsWithChildren<{
  initialSession?: AuthSession | null
}>

const AppStateSync = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => state.app.theme)
  const {session} = useAuthSession()
  const userId = session?.user?.id
  const cartCount = useQuery({
    queryKey: ['cart-count', userId],
    queryFn: getCartCount,
    enabled: Boolean(userId)
  })
  const wishlistIds = useQuery({
    queryKey: ['wishlist-ids', userId],
    queryFn: getWishlistIds,
    enabled: Boolean(userId)
  })

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncTheme = () => {
      const resolvedTheme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      dispatch(setResolvedTheme(resolvedTheme))
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    }

    syncTheme()
    media.addEventListener('change', syncTheme)
    return () => media.removeEventListener('change', syncTheme)
  }, [dispatch, theme])

  useEffect(() => {
    if (!userId) dispatch(resetAccountState())
  }, [dispatch, userId])

  useEffect(() => {
    const count = cartCount.data?.data?.count
    if (userId && typeof count === 'number') dispatch(setCartCount(count))
  }, [cartCount.data, dispatch, userId])

  useEffect(() => {
    const ids = wishlistIds.data?.data?.ids
    if (userId && ids) dispatch(setWishlistIds(ids))
  }, [dispatch, userId, wishlistIds.data])

  return null
}

const MainProvider = ({children, initialSession}: MainProviderProps) => {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          gcTime: 300_000,
          retry: 1,
          refetchOnWindowFocus: false
        }
      }
    })
  )
  const [store] = useState(makeStore)

  useEffect(() => {
    const persistor = persistStore(store)
    return () => persistor.pause()
  }, [store])

  return (
    <AppProgressProvider>
      <AuthProvider initialSession={initialSession}>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <AppStateSync />
            <Navbar />
            <Suspense fallback={null}>
              <ToastListener />
            </Suspense>
            {children}
            <Toaster />
            <ThemeToggleButton />
            <ImpersonationIndicator />
            <Footer />
            <BottomNav />
          </QueryClientProvider>
        </ReduxProvider>
      </AuthProvider>
    </AppProgressProvider>
  )
}

export default MainProvider
