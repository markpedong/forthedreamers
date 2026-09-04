'use client';

import Image from 'next/image';
import { useState } from 'react';
import TwoFactorPage from './2fa';
import ForgotPasswordPage from './forgot-password';
import SignIn from './sign-in';
import SignUp from './sign-up';
import { useSearchParams } from 'next/navigation';

export default function AuthInterface() {
  const params = useSearchParams();
  const social = params.get('social');


  const [currentPage, setCurrentPage] = useState('login');
  const pages = {
    login: <SignIn onNavigate={setCurrentPage} />,
    register: <SignUp onNavigate={setCurrentPage} />,
    forgot: <ForgotPasswordPage onNavigate={setCurrentPage} />,
    '2fa': <TwoFactorPage onNavigate={setCurrentPage} />,
  };

  return (
    <div className='grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_560px]'>
      <div className='relative hidden overflow-hidden lg:block'>
        <Image
          src='/images/sign-in.webp'
          alt='Curated products'
          fill
          sizes='(min-width: 1024px) calc(100vw - 560px), 0px'
          priority
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black/25' />
        <div className='absolute bottom-10 left-10 max-w-md text-white'>
          <p className='mb-3 text-sm uppercase tracking-[0.24em] text-white/75'>For The Dreamers</p>
          <h1 className='text-5xl font-light leading-tight'>Curated finds, secure checkout.</h1>
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <div className='w-full'>{pages[currentPage as keyof typeof pages]}</div>
      </div>
    </div>
  );
}
