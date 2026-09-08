'use client';

import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
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

const Seller2FA: FC<{ onNavigate: TOnNavigate }> = ({ onNavigate }) => {
  const router = useRouter();
  const [useBackup, setUseBackup] = useState(false);
  const { twoFactorSchema } = formSchemas;
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
      router.push('/dashboard');
    });
  };

  return (
    <AuthCard
      title={useBackup ? 'Backup code' : 'Enter verification code'}
      description={useBackup ? 'Enter one of your backup codes' : 'Enter the 6-digit code from your authenticator app'}
      icon={<ShieldCheck className="size-5" />}
    >
          <Form className="space-y-4" form={form} onSubmit={onSubmit} submitLabel={isPending ? 'Verifying...' : 'Verify'}>
            <Input
              control={form.control}
              name="otp"
              label="Verification Code"
              type="text"
              placeholder={useBackup ? 'XXXX-XXXX-XXXX' : '000000'}
              maxLength={useBackup ? 14 : 6}
              disabled={isPending}
            />
          </Form>

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
