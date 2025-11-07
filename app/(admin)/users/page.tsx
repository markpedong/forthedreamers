import { getSession, listUsers, permissionListUsers } from '@/lib/server-actions';
import Users from './index';
import { APIError } from 'better-auth';
import { redirect } from 'next/navigation';

type Props = {};

const Page = async () => {
  const session = await getSession();

  if (!(await permissionListUsers()).success) {
    redirect('/');
  }

  try {
    const users = await listUsers();
    const filteredUsers = users.users.filter((u) => u.id !== session?.user.id);

    return <Users users={filteredUsers} />;
  } catch (err) {
    if (err instanceof APIError && err.message.includes('not allowed')) {
      redirect('/products');
    }

    redirect('/error');
  }
};

export default Page;
