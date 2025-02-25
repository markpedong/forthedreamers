import NavBar from '@/app/_components/navbar'
import Provider from '@/app/_components/provider'
import { SF_PRO_DISPLAY } from '@/public/fonts'
import './globals.scss'

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={SF_PRO_DISPLAY.className}>
				<Provider>
					<NavBar />
					{children}
				</Provider>
			</body>
		</html>
	)
}
