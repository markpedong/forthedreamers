import { useAppSelector } from '@/redux/store'
import React, { FC } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme } from 'antd'
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const ThemesProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
	let browserQueryClient: QueryClient | undefined = undefined
	const darkMode = useAppSelector(state => state.app.darkMode)

	const makeQueryClient = () => {
		return new QueryClient({
			defaultOptions: {
				queries: {
					// With SSR, we usually want to set some default staleTime
					// above 0 to avoid refetching immediately on the client
					staleTime: 6 * 1000 // 6 sec
				}
			}
		})
	}

	const getQueryClient = () => {
		if (isServer) {
			return makeQueryClient()
		} else {
			if (!browserQueryClient) browserQueryClient = makeQueryClient()
			return browserQueryClient
		}
	}
	const queryClient = getQueryClient()

	return (
		<NextThemesProvider attribute="class" defaultTheme={darkMode ? 'dark' : 'light'}>
			<AntdRegistry>
				<QueryClientProvider client={queryClient}>
					<ConfigProvider
						theme={{
							algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
							token: { fontFamily: 'Sora', colorPrimary: '#000' }
						}}
					>
						{children}
					</ConfigProvider>
				</QueryClientProvider>
			</AntdRegistry>
		</NextThemesProvider>
	)
}

export default ThemesProvider
