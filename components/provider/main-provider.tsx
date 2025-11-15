'use client'

import { ThemeProvider } from 'next-themes'
import { FC, PropsWithChildren, Suspense } from 'react'
import { Toaster } from '../ui/sonner'
import ThemeToggleButton from './theme-toggle'
import ToastListener from './toast-listener'
import ImpesonationIndicator from './impersonation-indicator'
import ReduxProvider from './redux-provider'
import Navbar from '../navigation/navbar'
import BottomNav from '../navigation/bottom-nav'
import AntdWrapper from './antd-wrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from '../navigation/footer'

const MainProvider: FC<PropsWithChildren> = ({children}) => {
  const queryClient = new QueryClient()

  return (
    <ReduxProvider>
      <Navbar />
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <Suspense fallback={null}>
          <ToastListener />
        </Suspense>
        <QueryClientProvider client={queryClient}>
          <AntdWrapper>{children}</AntdWrapper>
        </QueryClientProvider>
        <Toaster />
        <ThemeToggleButton />
        <ImpesonationIndicator />
      </ThemeProvider>
      <Footer />
      <BottomNav />
    </ReduxProvider>
  )
}

export default MainProvider
