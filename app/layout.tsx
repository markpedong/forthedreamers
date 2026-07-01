import type { Metadata } from 'next'
import './globals.css'
import MainProvider from '@/components/provider/main-provider'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'

const geist = localFont({
  src: [
    {path: '../public/font/geist/Geist-Thin.ttf', weight: '100', style: 'normal'},
    {path: '../public/font/geist/Geist-ExtraLight.ttf', weight: '200', style: 'normal'},
    {path: '../public/font/geist/Geist-Light.ttf', weight: '300', style: 'normal'},
    {path: '../public/font/geist/Geist-Regular.ttf', weight: '400', style: 'normal'},
    {path: '../public/font/geist/Geist-Medium.ttf', weight: '500', style: 'normal'},
    {path: '../public/font/geist/Geist-SemiBold.ttf', weight: '600', style: 'normal'},
    {path: '../public/font/geist/Geist-Bold.ttf', weight: '700', style: 'normal'},
    {path: '../public/font/geist/Geist-ExtraBold.ttf', weight: '800', style: 'normal'},
    {path: '../public/font/geist/Geist-Black.ttf', weight: '900', style: 'normal'}
  ],
  variable: '--font-geist',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    template: '%s | For the Dreamers',
    absolute: 'For the Dreamers'
  },
  description: 'A modern marketplace for independent dreamers and makers.'
}

export default async function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geist.className}  antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <MainProvider>{children}</MainProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
