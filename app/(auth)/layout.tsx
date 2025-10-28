import { getSession } from '@/lib/server-actions';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (session) {
    redirect('/profile');
  }

  return children;
}
