'use client';

import { ThemeProvider } from 'next-themes';
import { FC, PropsWithChildren, Suspense } from 'react';
import { Toaster } from '../ui/sonner';
import ThemeToggleButton from './theme-toggle';
import ErrorLogger from './error-logger';

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <Suspense fallback={null}>
        <ErrorLogger />
      </Suspense>
      {children}
      <Toaster />
      <ThemeToggleButton />
    </ThemeProvider>
  );
};

export default MainProvider;
