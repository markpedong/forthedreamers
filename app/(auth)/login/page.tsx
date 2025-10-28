'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppleIcon, FacebookIcon, GoogleIcon, TikTokIcon } from '@/components/icons/oauth';

type TOnNavigate = (page: string) => void;

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='min-h-screen flex items-center justify-center p-4 bg-background text-foreground'>
    <div className='w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-lg p-8'>
      {children}
    </div>
  </div>
);

const LoginPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => (
  <PageWrapper>
    <div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Welcome back</h1>
        <p className='text-muted-foreground'>Sign in to your account to continue</p>
      </div>

      <div className='space-y-5'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='email' placeholder='you@example.com' className='h-11' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input id='password' type='password' placeholder='••••••••' className='h-11' />
        </div>

        <div className='flex items-center justify-end'>
          <button
            onClick={() => onNavigate('forgot')}
            className='text-sm text-primary hover:underline'
          >
            Forgot password?
          </button>
        </div>

        <Button className='w-full h-11'>Sign in</Button>
      </div>

      <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-4 bg-card text-muted-foreground'>or continue with</span>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {[GoogleIcon, AppleIcon, FacebookIcon, TikTokIcon].map((Icon, i) => (
          <Button key={i} variant='outline' className='h-11'>
            <Icon />
            <span className='ml-2'>{['Google', 'Apple', 'Facebook', 'TikTok'][i]}</span>
          </Button>
        ))}
      </div>

      <p className='text-center text-sm text-muted-foreground mt-6'>
        Don't have an account?{' '}
        <button onClick={() => onNavigate('register')} className='text-primary hover:underline'>
          Create account
        </button>
      </p>
    </div>
  </PageWrapper>
);

const RegisterPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => (
  <PageWrapper>
    <div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Create account</h1>
        <p className='text-muted-foreground'>Sign up to get started</p>
      </div>

      <div className='space-y-5'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Full Name</Label>
          <Input id='name' type='text' placeholder='John Doe' className='h-11' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='reg-email'>Email</Label>
          <Input id='reg-email' type='email' placeholder='you@example.com' className='h-11' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='reg-password'>Password</Label>
          <Input id='reg-password' type='password' placeholder='••••••••' className='h-11' />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirm-password'>Confirm Password</Label>
          <Input id='confirm-password' type='password' placeholder='••••••••' className='h-11' />
        </div>

        <Button className='w-full h-11'>Create Account</Button>
      </div>

      <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-4 bg-card text-muted-foreground'>or continue with</span>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {[GoogleIcon, AppleIcon, FacebookIcon, TikTokIcon].map((Icon, i) => (
          <Button key={i} variant='outline' className='h-11'>
            <Icon />
            <span className='ml-2'>{['Google', 'Apple', 'Facebook', 'TikTok'][i]}</span>
          </Button>
        ))}
      </div>

      <p className='text-center text-sm text-muted-foreground mt-6'>
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className='text-primary hover:underline'>
          Sign in
        </button>
      </p>
    </div>
  </PageWrapper>
);

const ForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => (
  <PageWrapper>
    <div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Reset password</h1>
        <p className='text-muted-foreground'>Enter your email to receive a reset link</p>
      </div>

      <div className='space-y-5'>
        <div className='space-y-2'>
          <Label htmlFor='forgot-email'>Email</Label>
          <Input id='forgot-email' type='email' placeholder='you@example.com' className='h-11' />
        </div>

        <Button className='w-full h-11'>Send reset link</Button>
      </div>

      <div className='mt-6 text-center'>
        <button
          onClick={() => onNavigate('login')}
          className='text-sm text-muted-foreground hover:text-foreground inline-flex items-center transition-colors'
        >
          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
          Back to sign in
        </button>
      </div>
    </div>
  </PageWrapper>
);

const TwoFactorPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const [useBackup, setUseBackup] = useState(false);
  return (
    <PageWrapper>
      <div>
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-primary'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold mb-2'>
            {useBackup ? 'Use backup code' : 'Two-factor authentication'}
          </h1>
          <p className='text-muted-foreground'>
            {useBackup
              ? 'Enter one of your backup codes'
              : 'Enter the 6-digit code from your authenticator app'}
          </p>
        </div>

        <div className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='code'>{useBackup ? 'Backup Code' : 'Authentication Code'}</Label>
            <Input
              id='code'
              type='text'
              placeholder={useBackup ? 'XXXX-XXXX-XXXX' : '000000'}
              maxLength={useBackup ? 14 : 6}
              className={`h-11 text-center tracking-widest font-mono ${useBackup ? 'text-lg' : 'text-2xl'}`}
            />
          </div>

          <Button className='w-full h-11'>Verify</Button>
        </div>

        <div className='mt-6 space-y-3 text-center'>
          {!useBackup && (
            <button className='text-sm text-primary hover:underline block w-full'>
              Resend code
            </button>
          )}
          <button
            onClick={() => setUseBackup(!useBackup)}
            className='text-sm text-muted-foreground hover:text-foreground block w-full'
          >
            {useBackup ? 'Use authenticator code instead' : 'Use backup code'}
          </button>
          <button
            onClick={() => onNavigate('login')}
            className='text-sm text-muted-foreground hover:text-foreground inline-flex items-center mx-auto transition-colors'
          >
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Go back
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default function AuthInterface() {
  const [currentPage, setCurrentPage] = useState('login');
  const pages = {
    login: <LoginPage onNavigate={setCurrentPage} />,
    register: <RegisterPage onNavigate={setCurrentPage} />,
    forgot: <ForgotPasswordPage onNavigate={setCurrentPage} />,
    '2fa': <TwoFactorPage onNavigate={setCurrentPage} />,
  };

  return (
    <div className='relative'>
      <div className='fixed top-4 right-4 z-50 bg-card border rounded-lg shadow-md p-2 flex gap-2'>
        {Object.keys(pages).map((key) => (
          <button
            key={key}
            onClick={() => setCurrentPage(key)}
            className={`px-3 py-1 rounded text-xs font-medium ${
              currentPage === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {pages[currentPage as keyof typeof pages]}
    </div>
  );
}
