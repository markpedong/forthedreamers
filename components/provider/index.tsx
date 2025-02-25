'use client'

import { persistor, store } from '@/redux/store'
import { HeroUIProvider } from '@heroui/react'
import React, { FC } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
type Props = {
	children: React.ReactNode
}

const Provider: FC<Props> = ({ children }) => {
	return (
		<ReduxProvider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<HeroUIProvider>{children}</HeroUIProvider>
			</PersistGate>
		</ReduxProvider>
	)
}

export default Provider
