'use client'

import { persistor, store } from '@/redux/store'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { SessionProvider } from 'next-auth/react'
import React, { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import NavBar from '../navbar'
import Footer from '../footer'

type Props = {
  children: React.ReactNode
}

const Provider: FC<Props> = ({ children }) => {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        <PersistGate loading={null} persistor={persistor}>
          <HeroUIProvider>
            <ToastProvider />
            <NextThemesProvider attribute="class" defaultTheme={isDarkMode ? 'dark' : 'light'}>
              <NavBar />
              {children}
              <Footer />
            </NextThemesProvider>
          </HeroUIProvider>
        </PersistGate>
      </SessionProvider>
    </ReduxProvider>
  )
}

export default Provider
