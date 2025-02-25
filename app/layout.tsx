import Provider from '@/app/_components/provider'
import './globals.scss'
import { Inter } from 'next/font/google'
import NavBar from '@/app/_components/navbar'

const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Provider>
					<NavBar />
					{children}
				</Provider>
			</body>
		</html>
	)
}
