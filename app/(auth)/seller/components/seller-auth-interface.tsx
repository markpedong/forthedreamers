'use client';

import { useState } from 'react';
import SellerTwoFactorPage from './seller-2fa';
import SellerForgotPasswordPage from './seller-forgot';
import SellerSignIn from './seller-sign-in';
import SellerSignUp from './seller-sign-up';
import SellerPageWrapper from './seller-page-wrapper';

export default function SellerAuthInterface() {
  const [currentPage, setCurrentPage] = useState('login');
  const pages = {
    login: <SellerSignIn onNavigate={setCurrentPage} />,
    register: <SellerSignUp onNavigate={setCurrentPage} />,
    forgot: <SellerForgotPasswordPage onNavigate={setCurrentPage} />,
    '2fa': <SellerTwoFactorPage onNavigate={setCurrentPage} />,
  };

  return (
    <div className='min-h-screen'>
      {currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot' ? (
        <SellerPageWrapper>{pages[currentPage as keyof typeof pages]}</SellerPageWrapper>
      ) : (
        pages[currentPage as keyof typeof pages]
      )}
    </div>
  );
}
