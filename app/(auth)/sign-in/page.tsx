'use client';

import loginImage from '@/public/images/sign-in.webp';
import Image from 'next/image';
import { useState } from 'react';
import TwoFactorPage from './components/2fa';
import ForgotPasswordPage from './components/forgot-password';
import SignIn from './components/sign-in';
import SignUp from './components/sign-up';

export default function AuthInterface() {
  const [currentPage, setCurrentPage] = useState('login');
  const pages = {
    login: <SignIn onNavigate={setCurrentPage} />,
    register: <SignUp onNavigate={setCurrentPage} />,
    forgot: <ForgotPasswordPage onNavigate={setCurrentPage} />,
    '2fa': <TwoFactorPage onNavigate={setCurrentPage} />,
  };

  return (
    <div className='flex min-h-screen bg-background'>
      <div className='hidden lg:flex flex-1 relative'>
        <Image
          src={loginImage}
          alt='Login illustration'
          fill
          priority
          className='object-cover object-center'
        />
      </div>

      <div className='flex flex-1 items-center justify-center'>
        <div className='w-full max-w-xl'>{pages[currentPage as keyof typeof pages]}</div>
      </div>
    </div>
  );
}
