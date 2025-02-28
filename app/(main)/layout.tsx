import { SF_PRO_DISPLAY } from '@/public/fonts'
import '../globals.scss'
import Provider from '@/components/provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={SF_PRO_DISPLAY.className}>
				<Provider>{children}</Provider>
			</body>
		</html>
	)
}
