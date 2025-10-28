import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import MainProvider from '@/components/provider/main-provider';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Better-Auth Tutorial',
    absolute: 'Better-Auth Tutorial by Coding in Flow',
  },
  description:
    'Learn how to handle authentication in Next.js using Better-Auth with this tutorial by Coding in Flow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
