'use client';

import { ThemeProvider } from 'next-themes';
import { FC, PropsWithChildren, Suspense } from 'react';
import { Toaster } from '../ui/sonner';
import ThemeToggleButton from './theme-toggle';
import ToastListener from './toast-listener';
import ImpesonationIndicator from './impersonation-indicator';
import { Session } from '@/lib/types';
import { Navbar } from '../navigation/navbar';
import { BottomNav } from '../navigation/bottom-nav';

const MainProvider: FC<PropsWithChildren<{ session: Session }>> = ({ children, session }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
      <Navbar />
      {children}
      <BottomNav />
      <Toaster />
      <ThemeToggleButton />
      {!!session && <ImpesonationIndicator session={session} />}
    </ThemeProvider>
  );
};

export default MainProvider;
