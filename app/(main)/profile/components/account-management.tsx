'use client';

import { FC, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react';
import { CHANGE_PASSWORD_DEFAULT, OAUTH_PROVIDERS } from '@/constants';
import useFormSchema from '@/hooks/useFormSchema';
import { requestPasswordReset, linkSocial } from '@/lib/auth-client';
import { changePassword, unlinkAccount } from '@/lib/server-actions';
import { Account, SchemaForm } from '@/lib/types';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import Divider from '@/components/reusable/divider';
import AccountCard from '@/components/reusable/account-card';
import AlertDialog from '@/components/reusable/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tryWithToast } from '@/utils/helper';
import { useAppSelector } from '@/redux/store';

interface AccountManagementProps {
  accounts: Account[];
  hasPassword: boolean;
}

const AccountManagement: FC<AccountManagementProps> = ({ hasPassword, accounts }) => {
  const session = useAppSelector((state) => state.appData.session);
  const user = session?.user;
  const router = useRouter();
  const { changePasswordSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: CHANGE_PASSWORD_DEFAULT,
  });

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isSubmitting, startSubmitting] = useTransition();

  const onSubmit = (values: SchemaForm<typeof changePasswordSchema>) => {
    startSubmitting(async () => {
      const result = await tryWithToast(
        changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.confirmPassword,
        }),
      );
      if (!result) return;

      toast.success('Password changed successfully!', {
        description: 'Revoking other sessions...',
      });

      form.reset(CHANGE_PASSWORD_DEFAULT);
      setShowPasswordDialog(false);
    });
  };

  const handleSetPassword = () => {
    startSubmitting(async () => {
      const result = await tryWithToast(
        requestPasswordReset({
          email: `${user?.email}`,
          redirectTo: '/reset-password',
        }),
      );
      if (!result) return;

      toast.success('Password reset link sent successfully');
    });
  };

  const handleUnlinkAccount = (accountId: string, providerId: string) => {
    startSubmitting(async () => {
      const result = await tryWithToast(unlinkAccount({ accountId, providerId }));
      if (!result) return;

      toast.success('Account unlinked successfully');
      router.refresh();
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account security and linked accounts</CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <section>
            <p className='mb-2 font-semibold text-foreground'>Linked Accounts</p>
            {accounts.length ? (
              <div className='space-y-2'>
                {accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    provider={account.providerId}
                    account={account}
                    loading={isSubmitting}
                    onClick={(provider) => handleUnlinkAccount(account.accountId, provider)}
                  />
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>No linked accounts</p>
            )}
          </section>

          <section>
            <p className='mb-2 font-semibold text-foreground'>Available for Linking</p>
            <div className='grid gap-3'>
              {OAUTH_PROVIDERS.filter(
                (provider) => !accounts.some((a) => a.providerId === provider),
              ).map((provider) => (
                <AccountCard
                  key={provider}
                  provider={provider}
                  account={null}
                  loading={isSubmitting}
                  onClick={(provider) =>
                    linkSocial({
                      provider,
                      callbackURL: '/profile?accountLinked=true&tab=account',
                    })
                  }
                />
              ))}
            </div>
          </section>

          <Divider />

          <section className='rounded-lg border border-border bg-muted/30 p-4'>
            <div className='flex items-start gap-4'>
              <div
                className={`rounded-full p-2 ${
                  hasPassword ? 'bg-green-500/10' : 'bg-amber-500/10'
                }`}
              >
                {hasPassword ? (
                  <ShieldCheck className='h-5 w-5 text-green-600 dark:text-green-400' />
                ) : (
                  <ShieldAlert className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                )}
              </div>

              <div className='flex-1 space-y-3'>
                <div>
                  <p className='font-medium text-foreground'>
                    {hasPassword ? 'Password Protection Active' : 'No Password Set'}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {hasPassword
                      ? 'Your account is secured with a password. You can update it anytime.'
                      : 'Set a password to secure your account and enable additional login options.'}
                  </p>
                </div>

                <Button
                  variant={hasPassword ? 'outline' : 'default'}
                  size='sm'
                  onClick={() => (hasPassword ? setShowPasswordDialog(true) : handleSetPassword())}
                  disabled={isSubmitting}
                  className='gap-2'
                >
                  <KeyRound className='h-4 w-4' />
                  {hasPassword ? 'Change Password' : isSubmitting ? 'Sending...' : 'Set Password'}
                </Button>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
      <AlertDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        title='Change Password'
        description='Enter your current and new password.'
        confirmText='Change Password'
        loading={isSubmitting}
        onConfirm={form.handleSubmit(onSubmit)}
        onCancel={() => form.reset({ currentPassword: '', newPassword: '', confirmPassword: '' })}
      >
        <Form form={form} onSubmit={onSubmit} customSubmitButton className='mt-8'>
          <Input
            control={form.control}
            name='currentPassword'
            label='Current Password'
            type='password'
            placeholder='••••••••'
            disabled={isSubmitting}
          />
          <Input
            control={form.control}
            name='newPassword'
            label='New Password'
            type='password'
            placeholder='••••••••'
            disabled={isSubmitting}
          />
          <Input
            control={form.control}
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            placeholder='••••••••'
            disabled={isSubmitting}
          />
        </Form>
      </AlertDialog>
    </>
  );
};

export default AccountManagement;
