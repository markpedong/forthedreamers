'use client';

import { FC, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SchemaForm, SessionUser } from '@/lib/types';
import { useForm } from 'react-hook-form';
import useFormSchema from '@/hooks/useFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TWOFACTOR_DEFAULT } from '@/constants';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { twoFactorEnable } from '@/lib/server-actions';
import AlertDialog from '@/components/reusable/alert-dialog';
import QRCode from 'react-qr-code';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { AlertCircle, Check, CopyIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type SetupStep = 'password' | 'qr-code' | 'backup-codes' | '';

const TwoFactorSection: FC<{ user: SessionUser }> = ({ user }) => {
  const router = useRouter();
  const is2faEnabled = user.twoFactorEnabled;
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

  const dialogDescription = {
    password: `Enter your password to ${is2faEnabled ? 'disable' : 'enable'} two-factor authentication`,
    ['qr-code']:
      'Scan this QR code with your authenticator app, then enter the 6-digit code below.',
    ['backup-codes']: 'Your backup codes are ready. Save them in a secure place.',
  };

  const submitTitle = {
    password: is2faEnabled ? 'Disable' : 'Validate Password',
    ['qr-code']: 'Validate OTP Code',
    ['backup-codes']: 'Done',
  };

  const onSubmit = async ({ password, otp }: SchemaForm<typeof twoFactorSchema>) => {
    if (setupStep === 'qr-code' && (!otp || otp.length < 6)) {
      form.setFocus('otp');
      form.setError('otp', { message: 'OTP must be 6 digits' });
      return;
    }

    startTransition(async () => {
      try {
        if (is2faEnabled) {
          await authClient.twoFactor.disable({ password: `${password}` });
          setSetupStep('');
          toast.success('Two-factor authentication has been disabled');
          form.reset(TWOFACTOR_DEFAULT);
          router.refresh();
          return;
        }

        if (setupStep === 'password') {
          const { totpURI, backupCodes } = await twoFactorEnable(`${password}`);
          setQrCodeUrl(totpURI);
          setBackupCodes(backupCodes);
          setSetupStep('qr-code');
        }

        if (setupStep === 'qr-code') {
          await authClient.twoFactor.verifyTotp({ code: `${otp}` });
          await new Promise((r) => setTimeout(r, 500));
          setShowVerificationSuccess(true);
          setSetupStep('backup-codes');
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : is2faEnabled
              ? 'Failed to disable two-factor authentication'
              : 'Failed to enable two-factor authentication';
        toast.error(message);
      }
    });
  };

  const renderQRCodeStep = () => (
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
        name='otp'
        placeholder='000000'
        disabled={isPending || showVerificationSuccess}
        autoFocus
        maxLength={6}
      />
    </>
  );

  const renderBackupCodesStep = () => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col items-center gap-3 py-8'
    >
      <div className='h-20 w-20 rounded-full bg-green-100 flex items-center justify-center'>
        <Check className='h-10 w-10 text-green-600' />
      </div>
      <p className='text-lg font-semibold text-green-600'>Verification successful!</p>
      <p className='text-sm text-muted-foreground'>Your authenticator is now linked.</p>

      <div className='w-full mt-6 space-y-3'>
        <div className='flex justify-between items-center'>
          <p className='text-sm font-medium text-foreground'>Backup Codes</p>
          <CopyIcon
            className='size-3 cursor-pointer'
            onClick={() => {
              navigator.clipboard.writeText(backupCodes.join('\n'));
              toast.success('Copied to clipboard');
            }}
          />
        </div>

        <div className='grid grid-cols-2 gap-2'>
          {backupCodes.map((code, i) => (
            <button
              key={i}
              type='button'
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success('Copied to clipboard');
              }}
              className='rounded-lg border border-border bg-muted p-2 text-left'
            >
              {code}
            </button>
          ))}
        </div>

        <div className='rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2'>
          <AlertCircle className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
          <p className='text-xs text-amber-800'>
            Save these codes in a safe place. Each can only be used once.
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </div>
            <Badge variant={is2faEnabled ? 'default' : 'secondary'}>
              {is2faEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-muted p-4 flex items-center justify-between'>
            <div>
              <p className='font-medium'>Status</p>
              <p className='text-sm text-muted-foreground'>
                {is2faEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Enable two-factor authentication to secure your account'}
              </p>
            </div>
            <Button
              variant={is2faEnabled ? 'destructive' : 'default'}
              onClick={() => setSetupStep('password')}
              disabled={isPending}
            >
              {is2faEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {is2faEnabled && (
            <div className='border-t border-border pt-4'>
              <Button
                variant='outline'
                onClick={() => setSetupStep('password')}
                disabled={isPending}
              >
                Regenerate Backup Codes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!setupStep}
        onOpenChange={(open) => {
          if (!open) {
            setSetupStep('');
            form.reset(TWOFACTOR_DEFAULT);
          }
        }}
        title={
          is2faEnabled ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'
        }
        description={dialogDescription[setupStep as keyof typeof dialogDescription]}
        confirmText={submitTitle[setupStep as keyof typeof submitTitle]}
        loading={isPending}
        onConfirm={form.handleSubmit(onSubmit)}
      >
        <Form form={form} customSubmitButton>
          {setupStep === 'password' && (
            <Input
              id='password'
              type='password'
              name='password'
              placeholder='Enter your password'
              disabled={isPending}
            />
          )}
          {setupStep === 'qr-code' && renderQRCodeStep()}
        </Form>

        {setupStep === 'backup-codes' && showVerificationSuccess && renderBackupCodesStep()}
      </AlertDialog>
    </>
  );
};

export default TwoFactorSection;
