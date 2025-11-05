'use client';

import { FC, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SchemaForm, SessionUser, SetupStep } from '@/lib/types';
import { useForm } from 'react-hook-form';
import useFormSchema from '@/hooks/useFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TWOFACTOR_DEFAULT } from '@/constants';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { generateBackupCodes, twoFactorEnable } from '@/lib/server-actions';
import AlertDialog from '@/components/reusable/alert-dialog';
import QRCode from 'react-qr-code';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { AlertCircle, CopyIcon, RefreshCw, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BackupCodesStep } from './2fa-components';
import { tryWithToast } from '@/utils/helper';

const TwoFactorSection: FC<{ user?: SessionUser }> = ({ user }) => {
  const router = useRouter();
  const is2faEnabled = user?.twoFactorEnabled;
  const { twoFactorSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: TWOFACTOR_DEFAULT,
  });

  const [setupStep, setSetupStep] = useState<SetupStep>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dialogDescription: Record<SetupStep, string> = {
    password: `Enter your password to ${is2faEnabled ? 'disable' : 'enable'} two-factor authentication`,
    'qr-code': 'Scan this QR code with your authenticator app, then enter the 6-digit code below.',
    'backup-codes': 'Your backup codes are ready. Save them in a secure place.',
    regenerate: 'Enter your password to regenerate your backup codes',
    'backup-codes-regenerated': 'Your backup codes have been regenerated. Store them safely.',
    '': '',
  };

  const submitTitle: Record<SetupStep, string> = {
    password: is2faEnabled ? 'Disable' : 'Validate Password',
    'qr-code': 'Validate OTP Code',
    'backup-codes': 'Done',
    regenerate: 'Continue',
    'backup-codes-regenerated': 'Done',
    '': '',
  };

  const handleApiError = (res: any, field?: 'password' | 'otp', message?: string) => {
    if (res?.error?.code) {
      if (field) form.setError(field, { message: message || 'Invalid input' });
      toast.error(message || 'Operation failed');
      return true;
    }
    return false;
  };

  const onSubmit = async ({ password, otp }: SchemaForm<typeof twoFactorSchema>) => {
    startTransition(async () => {
      const steps: Record<SetupStep, () => Promise<void>> = {
        password: async () => {
          if (is2faEnabled) {
            const res = await tryWithToast(
              authClient.twoFactor.disable({ password: password! })
            );
            if (!res || handleApiError(res, 'password', 'Invalid password')) return;
            toast.success('Two-factor authentication disabled');
            resetSetup();
          } else {
            const res = await tryWithToast(twoFactorEnable(password!));
            if (!res || !res.totpURI || !res.backupCodes?.length) {
              form.setError('password', { message: 'Invalid password or server error' });
              toast.error('Failed to enable 2FA');
              return;
            }
            setQrCodeUrl(res.totpURI);
            setBackupCodes(res.backupCodes);
            setSetupStep('qr-code');
          }
        },
        'qr-code': async () => {
          if (!otp || otp.length < 6) {
            form.setError('otp', { message: 'OTP must be 6 digits' });
            form.setFocus('otp');
            return;
          }
          const res = await tryWithToast(authClient.twoFactor.verifyTotp({ code: otp }));
          if (!res || handleApiError(res, 'otp', 'Invalid OTP code')) return;
          await new Promise((r) => setTimeout(r, 1500));
          setShowVerificationSuccess(true);
          setSetupStep('backup-codes');
        },
        'backup-codes': resetSetup,
        regenerate: async () => {
          const res = await tryWithToast(generateBackupCodes(password!));
          if (!res || !res.backupCodes?.length) {
            form.setError('password', { message: 'Invalid password' });
            toast.error('Failed to regenerate backup codes');
            return;
          }
          setBackupCodes(res.backupCodes);
          setSetupStep('backup-codes-regenerated');
        },
        'backup-codes-regenerated': resetSetup,
        '': async () => {},
      };

      await steps[setupStep]();
    });
  };

  const resetSetup = async () => {
    setSetupStep('');
    form.reset(TWOFACTOR_DEFAULT);
    router.refresh();
  };

  const QRCodeStep = () => (
    <>
      <div className='flex flex-col items-center gap-4'>
        <QRCode
          value={qrCodeUrl ?? ''}
          className='h-48 w-48 rounded-lg border border-border bg-white p-4'
        />
        <div className='w-full rounded-lg bg-muted p-3'>
          <div className='flex justify-between items-center mb-2 text-muted-foreground'>
            <p className='text-xs font-medium'>Can't scan?</p>
            <CopyIcon
              className='size-3 cursor-pointer'
              onClick={() => {
                navigator.clipboard.writeText(qrCodeUrl ?? '');
                toast.success('Copied to clipboard');
              }}
            />
          </div>
          <p className='text-xs text-muted-foreground break-all font-mono'>{qrCodeUrl}</p>
        </div>
      </div>
      <div className='rounded-lg bg-blue-50 border border-blue-200 p-3 flex gap-2'>
        <AlertCircle className='h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5' />
        <p className='text-sm text-blue-800'>
          Enter the 6-digit code from your authenticator app to confirm setup.
        </p>
      </div>
      <Input
        id='otp'
        label='Enter 6-digit code'
        type='number'
        name='otp'
        placeholder='000000'
        autoFocus
        maxLength={6}
      />
    </>
  );

  return (
    <>
      <Card className='gap-0'>
        <CardHeader className='pb-4'>
          <div className='flex items-start gap-3'>
            <div className='rounded-lg bg-primary/10 p-2'>
              <Shield className='h-5 w-5 text-primary' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between gap-2'>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <Badge variant={is2faEnabled ? 'default' : 'secondary'}>
                  {is2faEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <CardDescription className='mt-1'>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg border bg-card p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium text-foreground'>Current Status</span>
              {is2faEnabled && (
                <span className='inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400'>
                  <span className='radar-blip relative inline-block h-2 w-2 rounded-full bg-green-600 dark:bg-green-400'></span>
                  Protected
                </span>
              )}
            </div>
            <p className='text-sm text-muted-foreground'>
              {is2faEnabled
                ? 'Your account is protected with two-factor authentication'
                : 'Enable 2FA to add an extra layer of security to your account'}
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              className='flex-1'
              variant={is2faEnabled ? 'destructive' : 'default'}
              onClick={() => setSetupStep('password')}
              disabled={isPending}
            >
              {is2faEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>

          {is2faEnabled && (
            <Button
              variant='outline'
              className='w-full bg-transparent'
              onClick={() => setSetupStep('regenerate')}
              disabled={isPending}
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Regenerate Backup Codes
            </Button>
          )}
        </CardContent>
      </Card>
      <AlertDialog
        containerClassName='max-h-[80vh] overflow-y-auto'
        open={!!setupStep}
        onOpenChange={(open) => {
          if (!open) resetSetup();
        }}
        title={
          setupStep === 'regenerate'
            ? 'Regenerate Backup Codes'
            : setupStep === 'backup-codes-regenerated'
              ? 'New Backup Codes'
              : is2faEnabled
                ? 'Disable Two-Factor Authentication'
                : 'Enable Two-Factor Authentication'
        }
        description={dialogDescription[setupStep]}
        confirmText={submitTitle[setupStep]}
        loading={isPending}
        onConfirm={form.handleSubmit(onSubmit)}
        headerClassname='mb-6 gap-0'
      >
        <Form form={form} customSubmitButton>
          {['password', 'regenerate'].includes(setupStep) && (
            <Input
              id='password'
              type='password'
              name='password'
              placeholder='Enter password'
              disabled={isPending}
              preventSpaces
            />
          )}
          {setupStep === 'qr-code' && <QRCodeStep />}
        </Form>
        {(setupStep === 'backup-codes-regenerated' ||
          (setupStep === 'backup-codes' && showVerificationSuccess)) && (
          <BackupCodesStep
            step={setupStep as 'backup-codes' | 'backup-codes-regenerated'}
            backupCodes={backupCodes}
          />
        )}
      </AlertDialog>
    </>
  );
};

export default TwoFactorSection;
