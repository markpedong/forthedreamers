'use client'

import { FC, PropsWithChildren, Suspense, useState } from 'react'
import { Toaster } from '../ui/sonner'
import ThemeToggleButton from './theme-toggle'
import ToastListener from './toast-listener'
import ImpesonationIndicator from './impersonation-indicator'
import Navbar from '../navigation/navbar'
import BottomNav from '../navigation/bottom-nav'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProgressProvider } from '@bprogress/next'
import Footer from '../navigation/footer'
import { AuthProvider, useAuthSession, type AuthSession } from '@/lib/supabase/auth-context'

type MainProviderProps = PropsWithChildren<{
  initialSession?: AuthSession | null
}>

const MainProvider: FC<MainProviderProps> = ({ children, initialSession }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 300_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <AppProgressProvider>
      <AuthProvider initialSession={initialSession}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </AuthProvider>
    </AppProgressProvider>
  )
}

export default MainProvider
