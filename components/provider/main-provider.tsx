'use client'

import { ThemeProvider } from 'next-themes'
import { FC, PropsWithChildren, Suspense, useState } from 'react'
import { Toaster } from '../ui/sonner'
import ThemeToggleButton from './theme-toggle'
import ToastListener from './toast-listener'
import ImpesonationIndicator from './impersonation-indicator'
import Navbar from '../navigation/navbar'
import BottomNav from '../navigation/bottom-nav'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from '../navigation/footer'

const MainProvider: FC<PropsWithChildren> = ({children}) => {
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
    <>
      <Navbar />
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <Suspense fallback={null}>
          <ToastListener />
        </Suspense>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster />
        <ThemeToggleButton />
        <ImpesonationIndicator />
      </ThemeProvider>
      <Footer />
      <BottomNav />
    </>
  )
}

export default MainProvider
