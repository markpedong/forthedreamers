import { USER_ROLE } from '@/generated/prisma';
import { getSession } from '@/lib/services/auth';
import { listUsers } from '@/lib/services/admin-users';
import Users from './index';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getSession();

  if (session?.user.role !== USER_ROLE.ADMIN) {
    redirect('/');
  }

  let users;
  try {
    users = await listUsers();
  } catch (err) {
    if (err instanceof Error && err.message.includes('not allowed')) {
      redirect('/dashboard/products');
    }

    redirect('/');
  }

  return <Users users={users.filter(u => u.id !== session.user.id)} />;
};

export default Page;
