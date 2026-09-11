import type { Metadata } from 'next';
import './globals.css';
import MainProvider from '@/components/provider/main-provider';
import UserHydrator from '@/components/provider/user-hydrator';
import localFont from 'next/font/local';
import { Suspense } from 'react';

const geist = localFont({
  src: [
    { path: '../public/font/geist/Geist-Thin.ttf', weight: '100', style: 'normal' },
    { path: '../public/font/geist/Geist-ExtraLight.ttf', weight: '200', style: 'normal' },
    { path: '../public/font/geist/Geist-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/font/geist/Geist-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/font/geist/Geist-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/font/geist/Geist-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/font/geist/Geist-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/font/geist/Geist-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../public/font/geist/Geist-Black.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: 'For the Dreamers',
  title: {
    template: '%s | For the Dreamers',
    absolute: 'For the Dreamers',
  },
  description: 'A modern marketplace for independent dreamers and makers.',
  openGraph: {
    type: 'website',
    siteName: 'For the Dreamers',
    title: 'For the Dreamers',
    description: 'A modern marketplace for independent dreamers and makers.',
  },
  twitter: {
    card: 'summary',
    title: 'For the Dreamers',
    description: 'A modern marketplace for independent dreamers and makers.',
  },
};

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className}  antialiased`}>
        <MainProvider>
          <Suspense fallback={null}>
            <UserHydrator />
          </Suspense>
          {children}
        </MainProvider>
      </body>
    </html>
  );
};

export default RootLayout;
