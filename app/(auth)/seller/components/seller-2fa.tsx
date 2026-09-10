'use client';

import FormField from '@/components/reusable/form-field';
import formSchemas from '@/hooks/form-schemas';
import { SchemaForm, TOnNavigate } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { tryWithToast } from '@/utils/helper';
import AuthCard from '../../components/auth-card';
import { ShieldCheck } from 'lucide-react';

import { Button, SubmitButton } from '@/components/ui/button';

const Seller2FA: FC<{ onNavigate: TOnNavigate }> = ({ onNavigate }) => {
  const router = useRouter();
  const [useBackup, setUseBackup] = useState(false);
  const { twoFactorSchema } = formSchemas;

  const form = useForm<SchemaForm<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { otp: '' },
  });

  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit } = form;
  const { errors } = form.formState;

  const onSubmit = async (values: SchemaForm<typeof twoFactorSchema>) => {
    if (values?.otp?.length !== 6) {
      form.setError('otp', {
        message: `${useBackup ? 'Backup' : 'OTP'} must be ${useBackup ? '8' : '6'} digits`,
      });
      form.setFocus('otp');
      return;
    }

    startTransition(async () => {
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
      router.push('/dashboard');
    });
  };

  return (
    <AuthCard
      title={useBackup ? 'Backup code' : 'Enter verification code'}
      description={useBackup ? 'Enter one of your backup codes' : 'Enter the 6-digit code from your authenticator app'}
      icon={<ShieldCheck className="size-5" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField {...register('otp')} id="seller-2fa-otp" label="Verification Code" error={errors.otp?.message} type="text" placeholder={useBackup ? 'XXXX-XXXX-XXXX' : '000000'} maxLength={useBackup ? 14 : 6} disabled={isPending} />

        <SubmitButton title={isPending ? 'Verifying...' : 'Verify'} className="w-full h-11" disabled={isPending} aria-busy={isPending} />
      </form>

      <div className="mt-5 space-y-3 text-center">
        <button
          onClick={() => {
            form.reset();
            setUseBackup(!useBackup);
          }}
          className="block w-full text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {useBackup ? 'Use authenticator code' : 'Use backup code'}
        </button>

        <button
          onClick={() => onNavigate('login')}
          className="block w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to sign in
        </button>
      </div>
    </AuthCard>
  );
};

export default Seller2FA;
