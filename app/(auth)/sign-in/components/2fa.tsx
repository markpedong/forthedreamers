import { SchemaForm, TOnNavigate } from '@/lib/types';
import { useState, useTransition } from 'react';
import PageWrapper from './page-wrapper';
import useFormSchema from '@/hooks/useFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { toast } from 'sonner';
import { twoFactor } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { tryWithToast } from '@/utils/helper';

const TwoFactorPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const [useBackup, setUseBackup] = useState(false);
  const { twoFactorSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { otp: '' },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: SchemaForm<typeof twoFactorSchema>) => {
    if (values?.otp?.length !== 6) {
      form.setError('otp', {
        message: `${useBackup ? 'Backup' : 'OTP'} must be ${useBackup ? '8' : '6'} digits`,
      });
      form.setFocus('otp');
      return;
    }

    startTransition(async () => {
      const res = await tryWithToast(
        twoFactor.verifyTotp(
          { code: `${values.otp}` },
          {
            onSuccess: () => {
              toast.success('Sign in successfully!', { duration: 2000 });
              router.push('/profile');
            },
          },
        )
      );
      if (!res || !!res.error) return;
    });
  };

  return (
    <PageWrapper>
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
          {useBackup ? 'Backup code' : 'Two-factor authentication'}
        </h1>
        <p className='text-muted-foreground'>
          {useBackup
            ? 'Enter one of your backup codes'
            : 'Enter the 6-digit code from your authenticator app'}
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} submitLabel={isPending ? 'Verifying in...' : 'Verify'}>
        <Input
          name='otp'
          type='number'
          placeholder={useBackup ? 'XXXX-XXXX-XXXX' : '000000'}
          maxLength={useBackup ? 14 : 6}
        />
      </Form>

      <div className='mt-6 space-y-6 text-center'>
        <button
          onClick={() => {
            form.reset();
            setUseBackup(!useBackup);
          }}
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
    </PageWrapper>
  );
};

export default TwoFactorPage;
