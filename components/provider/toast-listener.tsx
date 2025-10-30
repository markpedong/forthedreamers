'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ToastListener = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const error = searchParams.get('error');
  const emailVerified = searchParams.get('emailVerified');

  const deleteParameter = (param: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete(param);

    const newQuery = nextSearchParams.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

    router.replace(newUrl);
  };

  useEffect(() => {
    if (pathname === '/profile' && emailVerified === 'true') {
      toast.success('Email verified successfully!', { duration: 3000 });
      deleteParameter('emailVerified');
      return;
    }

    if (error) {
      toast.error(`Error: ${error}, please try again.`, { duration: 3000 });
      deleteParameter('error');
      return;
    }
  }, []);

  return null;
};

export default ToastListener;
