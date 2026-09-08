import { getSession } from '@/lib/services/auth';
import { redirect } from 'next/navigation';

export default async function MainLayout({ children }: LayoutProps<'/'>) {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in?isSignedIn=false');
    return;
  }

  return children;
}
