'use client';

import { clearUserData } from '@/redux/reducers/userData';
import { useAppDispatch } from '@/redux/store';
import { useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

const ToastListener = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const error = searchParams.get('error');
  const emailVerified = searchParams.get('emailVerified');
  const accountLinked = searchParams.get('accountLinked');
  const isFromSocial = searchParams.get('social');
  const isSignedIn = searchParams.get('isSignedIn');

  const deleteParameters = useCallback(
    (keys: string[]) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      keys.forEach(key => nextSearchParams.delete(key));

      const newQuery = nextSearchParams.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

      setTimeout(() => router.replace(newUrl as Route, { scroll: false }), 100);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (isSignedIn === 'false') {
      queryClient.removeQueries();
      dispatch(clearUserData());
      router.replace('/sign-in');
    }
  }, [dispatch, isSignedIn, queryClient, router]);

  useEffect(() => {
    if (isFromSocial) {
      // Refresh session from server after social login redirect
      router.refresh();
      deleteParameters(['social']);
    }
  }, [deleteParameters, isFromSocial, router]);

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
  }, [accountLinked, deleteParameters, emailVerified, error]);

  return null;
};

export default ToastListener;
