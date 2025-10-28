'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

const Page: FC = () => {
  const error = useSearchParams().get('error');
  const router = useRouter();

  useEffect(() => {
    router.push('/login?error=' + error);
  }, [error]);

  return null;
};

export default Page;
