'use client';

import { ThemeProvider } from 'next-themes';
import { FC, PropsWithChildren, Suspense } from 'react';
import { Toaster } from '../ui/sonner';
import ThemeToggleButton from './theme-toggle';
import ToastListener from './toast-listener';
import ImpesonationIndicator from './impersonation-indicator';
import { useIsMobile } from '@/hooks/use-mobile';
import classNames from 'classnames';
import ReduxProvider from './redux-provider';
import Navbar from '../navigation/navbar';
import BottomNav from '../navigation/bottom-nav';

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <ReduxProvider>
      <Navbar />
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <Suspense fallback={null}>
          <ToastListener />
        </Suspense>
        <div className={classNames({ 'pb-20': isMobile })}>{children}</div>
        <Toaster />
        <ThemeToggleButton />
        <ImpesonationIndicator />
      </ThemeProvider>
      <BottomNav />
    </ReduxProvider>
  );
};

export default MainProvider;
