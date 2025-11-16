import type { Metadata } from 'next'
import './globals.css'
import MainProvider from '@/components/provider/main-provider'
import localFont from 'next/font/local'

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
    template: '%s | Better-Auth Tutorial',
    absolute: 'Better-Auth Tutorial by Coding in Flow'
  },
  description: 'Learn how to handle authentication in Next.js using Better-Auth with this tutorial by Coding in Flow'
}

export default async function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geist.className}  antialiased`}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  )
}
