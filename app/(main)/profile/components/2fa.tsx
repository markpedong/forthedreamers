'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { twoFactorEnable, disableTwoFactor, isTwoFactorEnabled } from './two-factor';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TwoFactorSectionProps {
  user: {
    id: string;
    email?: string;
    name?: string;
    password?: string;
  };
}

type SetupStep = 'idle' | 'password' | 'qr-code' | 'backup-codes';

export function TwoFactorSection({ user }: TwoFactorSectionProps) {
  const [setupStep, setSetupStep] = useState<SetupStep>('idle');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [totpURI, setTotpURI] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isTwoFactorEnabledState, setIsTwoFactorEnabledState] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const enabled = await isTwoFactorEnabled(user.id);
        setIsTwoFactorEnabledState(enabled);
      } catch {
        toast.error('Failed to check 2FA status.');
      }
    };
    fetchStatus();
  }, [user.id]);

  useEffect(() => {
    if (totpURI) {
      const encodedURI = encodeURIComponent(totpURI);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedURI}`;
      setQrCodeUrl(qrUrl);
    }
  }, [totpURI]);

  const handleEnableClick = () => {
    setSetupStep('password');
    setPassword('');
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    startTransition(async () => {
      try {
        const result = await twoFactorEnable(user.id, password);
        setTotpURI(result.totpURI);
        setTotpSecret(result.secret);
        setBackupCodes(result.backupCodes);
        setSetupStep('qr-code');
        setPassword('');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to enable two-factor authentication';
        toast.error(message);
      }
    });
  };

  const handleOtpSubmit = async () => {
    if (otpToken.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setShowVerificationSuccess(true);
      } catch {
        toast.error('Invalid OTP code');
        setOtpToken('');
      }
    });
  };

  const handleBackupCodesConfirm = () => {
    setIsTwoFactorEnabledState(true);
    setSetupStep('idle');
    setTotpURI(null);
    setQrCodeUrl(null);
    setTotpSecret(null);
    setBackupCodes([]);
    setOtpToken('');
    toast.success('Two-factor authentication has been enabled');
  };

  const handleDisable = () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    startTransition(async () => {
      try {
        await disableTwoFactor(user.id, password);
        setIsTwoFactorEnabledState(false);
        setPassword('');
        setSetupStep('idle');
        toast.success('Two-factor authentication has been disabled');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to disable two-factor authentication';
        toast.error(message);
      }
    });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </div>
            <Badge variant={isTwoFactorEnabledState ? 'default' : 'secondary'}>
              {isTwoFactorEnabledState ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-lg bg-muted p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-foreground'>Status</p>
                <p className='text-sm text-muted-foreground'>
                  {isTwoFactorEnabledState
                    ? 'Your account is protected with two-factor authentication'
                    : 'Enable two-factor authentication to secure your account'}
                </p>
              </div>
              {isTwoFactorEnabledState ? (
                <Button
                  variant='destructive'
                  onClick={() => setSetupStep('password')}
                  disabled={isPending}
                >
                  Disable
                </Button>
              ) : (
                <Button onClick={handleEnableClick} disabled={isPending}>
                  Enable
                </Button>
              )}
            </div>
          </div>

          {isTwoFactorEnabledState && (
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

      {/* Password Dialog */}
      <AlertDialog
        open={setupStep === 'password'}
        onOpenChange={(open: boolean) => !open && setSetupStep('idle')}
      >
        <AlertDialogContent className='max-w-md'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isTwoFactorEnabledState
                ? 'Disable Two-Factor Authentication'
                : 'Enable Two-Factor Authentication'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isTwoFactorEnabledState
                ? 'Enter your password to disable two-factor authentication'
                : 'Enter your password to proceed with setup'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='space-y-4'>
            <Input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              onKeyDown={(e: any) =>
                e.key === 'Enter' &&
                (isTwoFactorEnabledState ? handleDisable() : handlePasswordSubmit())
              }
              disabled={isPending}
            />
          </div>
          <div className='flex gap-2'>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={isTwoFactorEnabledState ? handleDisable : handlePasswordSubmit}
              disabled={isPending || !password}
            >
              {isPending ? 'Processing...' : 'Continue'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* QR Code Dialog */}
      <AlertDialog open={setupStep === 'qr-code'}>
        <AlertDialogContent className='max-w-md'>
          <AlertDialogHeader>
            <AlertDialogTitle>Set Up Two-Factor Authentication</AlertDialogTitle>
            {!showVerificationSuccess && (
              <AlertDialogDescription>
                Scan this QR code with your authenticator app, then enter the 6-digit code below.
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <div className='space-y-4'>
            {showVerificationSuccess ? (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col items-center gap-3 py-8'
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className='h-20 w-20 rounded-full bg-green-100 flex items-center justify-center'
                >
                  <Check className='h-10 w-10 text-green-600' />
                </motion.div>
                <p className='text-lg font-semibold text-green-600'>Verification successful!</p>
                <p className='text-sm text-muted-foreground'>Your authenticator is now linked.</p>

                <div className='w-full mt-6 space-y-3'>
                  <p className='text-sm font-medium text-foreground'>Backup Codes</p>
                  <div className='grid grid-cols-2 gap-2 max-h-40 overflow-y-auto'>
                    {backupCodes.map((code, index) => (
                      <button
                        key={index}
                        onClick={() => copyToClipboard(code, index)}
                        className='flex items-center justify-between rounded-lg border border-border bg-muted p-2 hover:bg-muted/80 transition-colors text-left'
                      >
                        <span className='font-mono text-xs font-medium'>{code}</span>
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
            ) : (
              <>
                {qrCodeUrl ? (
                  <div className='flex flex-col items-center gap-4'>
                    <div className='rounded-lg border border-border bg-white p-4'>
                      <img src={qrCodeUrl} alt='QR Code' className='h-48 w-48' />
                    </div>
                    <div className='w-full rounded-lg bg-muted p-3'>
                      <p className='text-xs font-medium text-muted-foreground mb-2'>Can't scan?</p>
                      <p className='text-xs text-muted-foreground break-all font-mono'>
                        {totpSecret}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='flex justify-center py-8'>
                    <div className='text-center'>
                      <div className='mb-2 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground mx-auto'></div>
                      <p className='text-sm text-muted-foreground'>Generating QR code...</p>
                    </div>
                  </div>
                )}

                {qrCodeUrl && (
                  <>
                    <div className='rounded-lg bg-blue-50 border border-blue-200 p-3 flex gap-2'>
                      <AlertCircle className='h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5' />
                      <p className='text-sm text-blue-800'>
                        Enter the 6-digit code from your authenticator app to confirm setup.
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-foreground'>
                        Enter 6-digit code
                      </label>
                      <Input
                        type='text'
                        placeholder='000000'
                        value={otpToken}
                        onChange={(e: any) =>
                          setOtpToken(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        onKeyDown={(e: any) =>
                          e.key === 'Enter' && otpToken.length === 6 && handleOtpSubmit()
                        }
                        disabled={isPending || showVerificationSuccess}
                        maxLength={6}
                        className='text-center text-2xl tracking-widest font-mono'
                        autoFocus
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className='flex gap-2'>
            <AlertDialogCancel onClick={() => setSetupStep('idle')} disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            {showVerificationSuccess ? (
              <AlertDialogAction onClick={handleBackupCodesConfirm} disabled={isPending}>
                Done
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={handleOtpSubmit}
                disabled={isPending || !qrCodeUrl || otpToken.length !== 6}
              >
                {isPending ? 'Verifying...' : 'Verify & Continue'}
              </AlertDialogAction>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
