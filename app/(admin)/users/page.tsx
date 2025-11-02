import { listUsers } from '@/lib/server-actions';
import Users from './index';

type Props = {};

const Page = async (props: Props) => {
  const users = await listUsers();
  return <Users />;
};

export default Page;
