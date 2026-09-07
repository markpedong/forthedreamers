'use client'

import { Suspense, type PropsWithChildren } from 'react'
import { AppProgressProvider } from '@bprogress/next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import BottomNav from '../navigation/bottom-nav'
import Footer from '../navigation/footer'
import Navbar from '../navigation/navbar'
import { Toaster } from '../ui/sonner'
import ImpersonationIndicator from './impersonation-indicator'
import ThemeToggleButton from './theme-toggle'
import ToastListener from './toast-listener'
import { AuthProvider, type AuthSession } from '@/lib/supabase/auth-context'
import { store } from '@/redux/store'

type MainProviderProps = PropsWithChildren<{
  initialSession?: AuthSession | null
}>

const MainProvider = ({ children, initialSession }: MainProviderProps) => {
  const queryClient = new QueryClient()

  return (
    <AppProgressProvider>
      <AuthProvider initialSession={initialSession}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
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
        </Provider>
      </AuthProvider>
    </AppProgressProvider>
  )
}

export default MainProvider
