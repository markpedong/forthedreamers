import { listUsers } from '@/lib/server-actions';

type Props = {};

const Page = async (props: Props) => {

  const users = await listUsers();
  
  return <div>Page</div>;
};

export default Page;
