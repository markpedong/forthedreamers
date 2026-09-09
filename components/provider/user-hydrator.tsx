'use client';

import { useEffect } from 'react';
import { setUserData } from '@/redux/reducers/userData';
import { useAppDispatch } from '@/redux/store';
import type { TUserData } from '@/services/types';

const UserHydrator = ({ user }: { user: TUserData | null }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) dispatch(setUserData(user));
  }, [dispatch, user]);

  return null;
};

export default UserHydrator;
