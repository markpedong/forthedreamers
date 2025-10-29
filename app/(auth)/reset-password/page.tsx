import { FC } from 'react';
import ResetPassword from '.';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ token: string }>;
};

const Page: FC<Props> = async ({ searchParams }) => {
  const token = (await searchParams).token;

  if (!token) {
    return redirect('/sign-in');
  }

  return <ResetPassword token={token} />;
};

export default Page;
