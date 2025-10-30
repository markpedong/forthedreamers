'use client';

import { ThemeProvider } from 'next-themes';
import { FC, PropsWithChildren, Suspense } from 'react';
import { Toaster } from '../ui/sonner';
import ThemeToggleButton from './theme-toggle';
import ToastListener from './toast-listener';

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
      {children}
      <Toaster />
      <ThemeToggleButton />
    </ThemeProvider>
  );
};

export default MainProvider;
