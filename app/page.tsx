import Link from 'next/link';

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <Link href='/sign-in'>Login</Link>
    </div>
  );
};

export default Page;
