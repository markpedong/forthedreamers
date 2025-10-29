'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC, Suspense, useEffect } from 'react';

const ErrorPage: FC = () => {
  const error = useSearchParams().get('error');
  const router = useRouter();

  useEffect(() => {
    router.push('/login?error=' + error);
  }, [error]);

  return null;
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <ErrorPage />
    </Suspense>
  );
};

export default Page;
