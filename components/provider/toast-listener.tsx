'use client';

import useWithDispatch from '@/hooks/useWithDispatch';
import { setSessionData } from '@/redux/features/appSlice';
import { useAppDispatch } from '@/redux/store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ToastListener = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { updateSession } = useWithDispatch();

  const error = searchParams.get('error');
  const emailVerified = searchParams.get('emailVerified');
  const accountLinked = searchParams.get('accountLinked');
  const isFromSocial = searchParams.get('social');
  const isSignedIn = searchParams.get('isSignedIn');

  const deleteParameters = (keys: string[]) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => nextSearchParams.delete(key));

    const newQuery = nextSearchParams.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

    setTimeout(() => router.replace(newUrl, { scroll: false }), 100);
  };

  useEffect(() => {
    if (isSignedIn === 'false') {
      dispatch(setSessionData(null));
      deleteParameters(['isSignedIn']);
    }
  }, [pathname, isSignedIn]);

  useEffect(() => {
    if (isFromSocial) {
      updateSession();
      deleteParameters(['social']);
    }
  }, [pathname, isFromSocial]);

  useEffect(() => {
    if (emailVerified) {
      toast.success('Email verified successfully!', { duration: 3000 });
      deleteParameters(['emailVerified']);
      return;
    }

    if (accountLinked) {
      toast.success('Account linked successfully!', { duration: 3000 });
      deleteParameters(['accountLinked', 'tab']);
      return;
    }

    if (error) {
      toast.error(`Error: ${error}, please try again.`, { duration: 3000 });
      deleteParameters(['error']);
    }
  }, [pathname, emailVerified, accountLinked, error]);

  return null;
};

export default ToastListener;
