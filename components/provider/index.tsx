'use client'

import { persistor, store } from '@/redux/store'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { SessionProvider } from 'next-auth/react'
import React, { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
type Props = {
  children: React.ReactNode
}

const Provider: FC<Props> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        <PersistGate loading={null} persistor={persistor}>
          <HeroUIProvider>
            <ToastProvider />
            {children}
          </HeroUIProvider>
        </PersistGate>
      </SessionProvider>
    </ReduxProvider>
  )
}

export default Provider
