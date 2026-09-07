'use client'

import {FC, PropsWithChildren, Suspense} from 'react'
import { Toaster } from '../ui/sonner'
import ThemeToggleButton from './theme-toggle'
import ToastListener from './toast-listener'
import ImpesonationIndicator from './impersonation-indicator'
import Navbar from '../navigation/navbar'
import BottomNav from '../navigation/bottom-nav'
import { AppProgressProvider } from '@bprogress/next'
import Footer from '../navigation/footer'
import {CartCountProvider} from './cart-count-provider'
import {WishlistProvider} from './wishlist-provider'
import {AuthProvider, type AuthSession} from '@/lib/supabase/auth-context'

type MainProviderProps = PropsWithChildren<{
  initialSession?: AuthSession | null
}>

const MainProvider: FC<MainProviderProps> = ({children, initialSession}) => {
  return (
    <AppProgressProvider>
      <AuthProvider initialSession={initialSession}>
        <CartCountProvider initialCount={0}>
          <WishlistProvider initialIds={[]}>
            <Navbar />
            <Suspense fallback={null}>
              <ToastListener />
            </Suspense>
            {children}
            <Toaster />
            <ThemeToggleButton />
            <ImpesonationIndicator />
            <Footer />
            <BottomNav />
          </WishlistProvider>
        </CartCountProvider>
      </AuthProvider>
    </AppProgressProvider>
  )
}

export default MainProvider
