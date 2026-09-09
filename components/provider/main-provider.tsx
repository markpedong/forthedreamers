'use client';

import { Suspense, useEffect, useState, type PropsWithChildren } from 'react';
import { AppProgressProvider } from '@bprogress/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import BottomNav from '../navigation/bottom-nav';
import Footer from '../navigation/footer';
import Navbar from '../navigation/navbar';
import { Toaster } from '../ui/sonner';
import ThemeToggleButton from './theme-toggle';
import ToastListener from './toast-listener';
import { setUserData } from '@/redux/reducers/userData';
import { store, useAppDispatch } from '@/redux/store';
import { useCurrentUserQuery } from '@/services/useQuery';

const HydrateUser = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isAuthRoute =
    pathname === '/sign-in' ||
    pathname === '/seller' ||
    pathname === '/verify-email' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/auth/');
  const { data: user } = useCurrentUserQuery(!isAuthRoute);

  useEffect(() => {
    if (user) dispatch(setUserData(user));
  }, [dispatch, user]);

  return null;
};

const MainProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppProgressProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <HydrateUser />
          <Navbar />
          <Suspense fallback={null}>
            <ToastListener />
          </Suspense>
          {children}
          <Toaster />
          <ThemeToggleButton />
          <Footer />
          <BottomNav />
        </QueryClientProvider>
      </Provider>
    </AppProgressProvider>
  );
};

export default MainProvider;
