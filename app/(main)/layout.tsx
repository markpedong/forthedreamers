import Navbar from '@/components/navigation/navbar';
import BottomNav from '@/components/navigation/bottom-nav';
import { getSession } from '@/lib/server-actions';
import { redirect } from 'next/navigation';

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
