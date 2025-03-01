'use client'

import { persistor, store } from '@/redux/store'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import React, { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import AuthProvider from '../auth'
import { SessionProvider } from 'next-auth/react'

type Props = {
	children: React.ReactNode
}

const Provider: FC<Props> = ({ children }) => {
	const { theme } = useTheme()
	const isDarkMode = theme === 'dark'

	return (
		<ReduxProvider store={store}>
			<SessionProvider>
				<AuthProvider>
					<PersistGate loading={null} persistor={persistor}>
						<HeroUIProvider>
							<ToastProvider />
							<NextThemesProvider attribute="class" defaultTheme={isDarkMode ? 'dark' : 'light'}>
								{children}
							</NextThemesProvider>
						</HeroUIProvider>
					</PersistGate>
				</AuthProvider>
			</SessionProvider>
		</ReduxProvider>
	)
}

export default Provider
