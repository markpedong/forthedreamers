'use client';

import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import useFormSchema from '@/hooks/useFormSchema';
import { SchemaForm, TOnNavigate } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { tryWithToast } from '@/utils/helper';

const Seller2FA: FC<{ onNavigate: TOnNavigate }> = ({ onNavigate }) => {
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
      // Mock implementation - wrap in promise for tryWithToast
      const result = await tryWithToast(
        Promise.resolve().then(() => {
          if (values.otp === '123456') {
            return { success: true };
          } else {
            throw new Error('Invalid code. Try again.');
          }
        })
      );
      if (!result) return;

      toast.success('Verified!', { duration: 2000 });
      router.push('/seller-dashboard');
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <div className='w-full max-w-md'>
        <div className='space-y-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold mb-1'>
              {useBackup ? 'Backup Code' : 'Enter Verification Code'}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {useBackup
                ? 'Enter one of your backup codes'
                : 'Enter the 6-digit code from your authenticator app'}
            </p>
          </div>

          <Form form={form} onSubmit={onSubmit} submitLabel={isPending ? 'Verifying...' : 'Verify'}>
            <Input
              control={form.control}
              name='otp'
              label='Verification Code'
              type='text'
              placeholder={useBackup ? 'XXXX-XXXX-XXXX' : '000000'}
              maxLength={useBackup ? 14 : 6}
              disabled={isPending}
            />
          </Form>

          <div className='space-y-2 text-center'>
            <button
              onClick={() => {
                form.reset();
                setUseBackup(!useBackup);
              }}
              className='text-sm text-primary hover:underline block w-full'
            >
              {useBackup ? 'Use authenticator code' : 'Use backup code'}
            </button>

            <button
              onClick={() => onNavigate('login')}
              className='text-sm text-muted-foreground hover:text-foreground block w-full'
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller2FA;
