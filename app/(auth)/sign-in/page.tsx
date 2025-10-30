import AuthInterface from './components';
import { getSession } from '@/lib/server-actions';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getSession();

  if (session) {
    redirect('/profile');
  }

  return <AuthInterface />;
};

export default Page;
