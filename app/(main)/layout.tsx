import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Navbar from '@/components/navigation/navbar';
import BottomNav from '@/components/navigation/bottom-nav';
import { getSession } from '@/lib/server-actions';
import { redirect } from 'next/navigation';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
    return;
  }

  return (
    <>
      <Navbar session={session} />
      {children}
      <BottomNav session={session} />
    </>
  );
}
