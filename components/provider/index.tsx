'use client'

import { persistor, store } from '@/redux/store'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { SessionProvider } from 'next-auth/react'
import React, { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import AuthProvider from '../auth'
import ThemesProvider from '../themes'
import { Toaster } from 'react-hot-toast'

type Props = {
	children: React.ReactNode
}

const Provider: FC<Props> = ({ children }) => {
	return (
		<ReduxProvider store={store}>
			<SessionProvider>
				<AuthProvider>
					<PersistGate loading={null} persistor={persistor}>
						<HeroUIProvider>
							<Toaster />
							<ToastProvider
								maxVisibleToasts={3}
								toastProps={{ timeout: 3000, classNames: { wrapper: 'toast-wrapper' } }}
							/>
							<ThemesProvider>{children}</ThemesProvider>
						</HeroUIProvider>
					</PersistGate>
				</AuthProvider>
			</SessionProvider>
		</ReduxProvider>
	)
}

export default Provider
