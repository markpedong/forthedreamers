import Link from 'next/link';

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <Link href='/login'>Login</Link>
    </div>
  );
};

export default Page;
