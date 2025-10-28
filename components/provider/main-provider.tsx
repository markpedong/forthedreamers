'use client';

import { ThemeProvider } from 'next-themes';
import { FC, PropsWithChildren } from 'react';
import { Toaster } from '../ui/sonner';
import ThemeToggleButton from './theme-toggle';

const MainProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
      <ThemeToggleButton />
    </ThemeProvider>
  );
};

export default MainProvider;
