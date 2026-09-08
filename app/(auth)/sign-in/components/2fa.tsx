import { SchemaForm, TOnNavigate } from '@/lib/types';
import { useState, useTransition } from 'react';
import AuthPage from '../../components/auth-page';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { toast } from 'sonner';
import { twoFactor } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { tryWithToast } from '@/utils/helper';
import AuthCard from '../../components/auth-card';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const TwoFactorPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
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
      const res = await tryWithToast(
        twoFactor.verifyTotp(
          { code: `${values.otp}` },
          {
            onSuccess: () => {
              toast.success('Sign in successfully!', { duration: 2000 });
              router.push('/profile');
            },
          }
        )
      );
      if (!res || !!res.error) return;
    });
  };

  return (
    <AuthPage>
      <AuthCard
        title={useBackup ? 'Backup code' : 'Two-factor authentication'}
        description={useBackup ? 'Enter one of your backup codes' : 'Enter the 6-digit code from your authenticator app'}
        icon={<ShieldCheck className="size-5" />}
      >
        <Form form={form} onSubmit={onSubmit} submitLabel={isPending ? 'Verifying in...' : 'Verify'}>
          <Input
            name="otp"
            type="number"
            placeholder={useBackup ? 'XXXX-XXXX-XXXX' : '000000'}
            maxLength={useBackup ? 14 : 6}
          />
        </Form>

        <div className="mt-3 space-y-3 text-center sm:mt-6 sm:space-y-6">
        <button
          onClick={() => {
            form.reset();
            setUseBackup(!useBackup);
          }}
          className="block w-full text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {useBackup ? 'Use authenticator code instead' : 'Use backup code'}
        </button>

        <button
          onClick={() => onNavigate('login')}
          className="mx-auto inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Go back
        </button>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default TwoFactorPage;
