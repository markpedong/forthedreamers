import { USER_ROLE } from '@/generated/prisma';
import { getSessionUser } from '@/lib/auth';
import { listUsers } from '@/lib/services/admin-users';
import Users from './index';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await getSessionUser();

  if (user?.role !== USER_ROLE.ADMIN) {
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

  return <Users users={users.filter(u => u.id !== user.id)} />;
};

export default Page;
