'use client';

import Image from 'next/image';
import { useState } from 'react';
import TwoFactorPage from './2fa';
import ForgotPasswordPage from './forgot-password';
import SignIn from './sign-in';
import SignUp from './sign-up';

export default function AuthInterface() {
  const [currentPage, setCurrentPage] = useState('login');
  const pages = {
    login: <SignIn onNavigate={setCurrentPage} />,
    register: <SignUp onNavigate={setCurrentPage} />,
    forgot: <ForgotPasswordPage onNavigate={setCurrentPage} />,
    '2fa': <TwoFactorPage onNavigate={setCurrentPage} />,
  };

  return (
    <div className="grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(0,1fr)_minmax(480px,560px)]">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/sign-in.webp"
          alt="Curated products"
          fill
          sizes="(min-width: 1024px) calc(100vw - 560px), 0px"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-10 bottom-10 max-w-lg text-white xl:inset-x-16 xl:bottom-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">For The Dreamers</p>
          <h1 className="text-4xl font-medium leading-tight tracking-tight xl:text-5xl">Curated finds, made effortless.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-white/75">A secure place to discover something worth keeping.</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-muted/30">
        <div className="w-full">{pages[currentPage as keyof typeof pages]}</div>
      </div>
    </div>
  );
}
