'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/http';
import { setUserData } from '@/redux/reducers/userData';
import { useAppDispatch } from '@/redux/store';

const UserHydrator = () => {
  const dispatch = useAppDispatch();
  const { data } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => (await getCurrentUser()).data?.user ?? null,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (data) dispatch(setUserData(data));
  }, [data, dispatch]);

  return null;
};

export default UserHydrator;
