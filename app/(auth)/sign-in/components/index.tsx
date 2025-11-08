'use client';

import loginImage from '@/public/images/sign-in.webp';
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

  if (social === 'true') {
    console.log('Social sign-in successful. Please check your email for further instructions.');
  }
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
