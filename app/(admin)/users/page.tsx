import { getSession, listUsers } from '@/lib/server-actions';
import Users from './index';

type Props = {};

const Page = async (props: Props) => {
  const [session, users] = await Promise.all([getSession(), listUsers()]);
  const filteredUsers = users.users.filter((user) => user.id !== session?.user.id);

  return <Users users={filteredUsers} />;
};

export default Page;
