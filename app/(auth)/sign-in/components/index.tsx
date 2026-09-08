'use client';

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
    <div className="w-full">{pages[currentPage as keyof typeof pages]}</div>
  );
}
