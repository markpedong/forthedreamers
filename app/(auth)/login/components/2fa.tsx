import { TOnNavigate } from '@/lib/types';
import { useState } from 'react';
import PageWrapper from './page-wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

export default TwoFactorPage;
