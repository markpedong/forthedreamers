import { getCurrentUserID } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MainLayout({ children }: LayoutProps<'/'>) {
  const userId = await getCurrentUserID();

  if (!userId) {
    redirect('/sign-in?isSignedIn=false');
    return;
  }

  return children;
}
