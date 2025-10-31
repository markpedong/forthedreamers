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
import { generateBackupCodes, twoFactorEnable } from '@/lib/server-actions';
import AlertDialog from '@/components/reusable/alert-dialog';
import QRCode from 'react-qr-code';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { AlertCircle, Check, Copy, CopyIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type SetupStep =
  | 'password'
  | 'qr-code'
  | 'backup-codes'
  | 'regenerate'
  | 'backup-codes-regenerated'
  | '';

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
    ['regenerate']: 'Enter your password to regenerate your backup codes',
    ['backup-codes-regenerated']:
      'Your backup codes have been regenerated. Store these new codes in a safe place.',
  };

  const submitTitle = {
    password: is2faEnabled ? 'Disable' : 'Validate Password',
    ['qr-code']: 'Validate OTP Code',
    ['backup-codes']: 'Done',
    ['regenerate']: 'Continue',
    ['backup-codes-regenerated']: 'Done',
  };

  const onSubmit = async ({ password, otp }: SchemaForm<typeof twoFactorSchema>) => {
    startTransition(async () => {
      try {
        if (is2faEnabled && setupStep === 'password') {
          const res = await authClient.twoFactor.disable({ password: `${password}` });
          
          if (!!res.error?.code) {
            form.setError('password', { message: 'Invalid password' });
            return;
          }

          setSetupStep('');
          toast.success('Two-factor authentication has been disabled');
          form.reset(TWOFACTOR_DEFAULT);
          router.refresh();
          return;
        }

        if (is2faEnabled && setupStep === 'regenerate') {
          const res = await generateBackupCodes(`${password}`);

          if (!res.backupCodes?.length) {
            toast.error('Failed to regenerate backup codes');
            form.setError('password', { message: 'Invalid password' });
            return;
          }

          setBackupCodes(res.backupCodes);
          setSetupStep('backup-codes-regenerated');
          return;
        }

        if (setupStep === 'password') {
          const res = await twoFactorEnable(`${password}`);

          if (!res.totpURI || !res.backupCodes?.length) {
            toast.error('Failed to enable two-factor authentication');
            form.setError('password', { message: 'Invalid password or server error' });
            return;
          }

          setQrCodeUrl(res.totpURI);
          setBackupCodes(res.backupCodes);
          setSetupStep('qr-code');
          return;
        }

        if (setupStep === 'qr-code') {
          if (!otp || otp.length < 6) {
            form.setError('otp', { message: 'OTP must be 6 digits' });
            form.setFocus('otp');
            return;
          }

          const res = await authClient.twoFactor.verifyTotp({ code: otp });

          if (!!res.error?.code) {
              form.setError('otp', { message: 'Invalid OTP code' });
              return;
          }

          await new Promise((r) => setTimeout(r, 1500));
          setShowVerificationSuccess(true);
          setSetupStep('backup-codes');
          return;
        }
        if (setupStep === 'backup-codes') {
          setSetupStep('');
          form.reset(TWOFACTOR_DEFAULT);
          router.refresh();
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

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
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
        <div className='flex gap-3 items-center'>
          <p className='text-sm font-medium text-foreground'>Backup Codes</p>
          <CopyIcon
            className='size-3 cursor-pointer'
            onClick={() => {
              navigator.clipboard.writeText(backupCodes.join('\n'));
              toast.success('Copied all backup codes to clipboard');
            }}
          />
        </div>

        <div className='grid grid-cols-2 gap-2'>
          {backupCodes.map((code, index) => (
            <button
              key={index}
              onClick={() => copyToClipboard(code, index)}
              className='flex items-center justify-between rounded-lg border border-border bg-muted p-2 hover:bg-muted/80 transition-colors text-left'
            >
              <span className='font-mono text-sm font-medium'>{code}</span>
              {copiedIndex === index ? (
                <Check className='h-4 w-4 text-green-600' />
              ) : (
                <Copy className='h-4 w-4 text-muted-foreground' />
              )}
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
                onClick={() => setSetupStep('regenerate')}
                disabled={isPending}
              >
                Regenerate Backup Codes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        containerClassName='max-h-[80vh] overflow-y-auto'
        open={!!setupStep}
        onOpenChange={(open) => {
          if (!open) {
            setSetupStep('');
            form.reset(TWOFACTOR_DEFAULT);
          }
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
        description={dialogDescription[setupStep as keyof typeof dialogDescription]}
        confirmText={submitTitle[setupStep as keyof typeof submitTitle]}
        loading={isPending}
        onConfirm={form.handleSubmit(onSubmit)}
      >
        <Form form={form} customSubmitButton>
          {['password', 'regenerate'].includes(setupStep) && (
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
        {setupStep === 'backup-codes-regenerated' && (
          <div className='space-y-4'>
            <div className='rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2'>
              <AlertCircle className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-amber-800'>
                Your old codes are no longer valid. Each new code can only be used once.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {backupCodes.map((code, index) => (
                <button
                  key={index}
                  onClick={() => copyToClipboard(code, index)}
                  className='flex items-center justify-between rounded-lg border border-border bg-muted p-2 hover:bg-muted/80 transition-colors text-left'
                >
                  <span className='font-mono text-sm font-medium'>{code}</span>
                  {copiedIndex === index ? (
                    <Check className='h-4 w-4 text-green-600' />
                  ) : (
                    <Copy className='h-4 w-4 text-muted-foreground' />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        {setupStep === 'backup-codes' && showVerificationSuccess && renderBackupCodesStep()}
      </AlertDialog>
    </>
  );
};

export default TwoFactorSection;
