'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ErrorLogger = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const error = searchParams.get('error');
  const nextSearchParams = new URLSearchParams(searchParams.toString());

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}, please try again.`, {
        duration: 3000,
      });

      nextSearchParams.delete('error');
      router.replace(`${pathname}?${nextSearchParams.toString()}`);
    }
  }, []);

  return null;
};

export default ErrorLogger;
