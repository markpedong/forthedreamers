import { SF_PRO_DISPLAY } from '@/public/fonts'
import '../globals.scss'
import Provider from '@/components/provider'
import NavBar from '@/components/navbar'
import Footer from '@/components/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={SF_PRO_DISPLAY.className}>
				<Provider>
					<NavBar />
					{children}
					<Footer />
				</Provider>
			</body>
		</html>
	)
}
