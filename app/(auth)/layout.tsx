import type { Metadata } from 'next';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: {
    template: '%s | For the Dreamers',
    absolute: 'For the Dreamers',
  },
  description: 'Curated finds, secure checkout.',
};

const AuthLayout = async ({ children }: LayoutProps<'/'>) => {
  const user = await getSessionUser();

  if (user) redirect(user.role === 'SELLER' || user.role === 'ADMIN' ? '/dashboard' : '/profile');

  return children;
};

export default AuthLayout;
