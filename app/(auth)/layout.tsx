import { getSession } from '@/lib/server-actions';
import { redirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

const AuthLayout: FC<PropsWithChildren> = async ({ children }) => {
  const session = await getSession();

  if (session) {
    redirect('/profile');
  }

  return children;
};

export default AuthLayout;
