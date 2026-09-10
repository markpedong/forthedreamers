'use client';

import { useState } from 'react';
import SellerTwoFactorPage from './seller-2fa';
import SellerForgotPasswordPage from './seller-forgot';
import SellerSignIn from './seller-sign-in';
import SellerSignUp from './seller-sign-up';

export default function SellerAuthInterface() {
  const [currentPage, setCurrentPage] = useState('login');
  const pages = {
    login: <SellerSignIn onNavigate={setCurrentPage} />,
    register: <SellerSignUp onNavigate={setCurrentPage} />,
    forgot: <SellerForgotPasswordPage onNavigate={setCurrentPage} />,
    '2fa': <SellerTwoFactorPage onNavigate={setCurrentPage} />,
  };

  return <div className="w-full">{pages[currentPage as keyof typeof pages]}</div>;
}
