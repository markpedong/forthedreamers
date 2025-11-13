import type { Metadata } from 'next'
import './globals.css'
import MainProvider from '@/components/provider/main-provider'
import { geist } from './font'

export const metadata: Metadata = {
  title: {
    template: '%s | Better-Auth Tutorial',
    absolute: 'Better-Auth Tutorial by Coding in Flow'
  },
  description: 'Learn how to handle authentication in Next.js using Better-Auth with this tutorial by Coding in Flow'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geist.className}  antialiased`}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  )
}
