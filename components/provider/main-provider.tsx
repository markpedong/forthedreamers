'use client';

import { Suspense, useState, type PropsWithChildren } from 'react';
import { AppProgressProvider } from '@bprogress/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import BottomNav from '../navigation/bottom-nav';
import Footer from '../navigation/footer';
import Navbar from '../navigation/navbar';
import { Toaster } from '../ui/sonner';
import ThemeToggleButton from './theme-toggle';
import ToastListener from './toast-listener';
import { store } from '@/redux/store';

const MainProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppProgressProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
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
