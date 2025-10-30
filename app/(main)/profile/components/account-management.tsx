'use client';

import AccountCard from '@/components/reusable/account-card';
import Form from '@/components/reusable/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Input from '@/components/reusable/input';
import { OAUTH_PROVIDERS } from '@/constants';
import useFormSchema from '@/hooks/useFormSchema';
import { authClient } from '@/lib/auth-client';
import {
  changePassword,
  deleteAccount,
  requestPasswordReset,
  unlinkAccount,
} from '@/lib/server-actions';
import { Account, SchemaForm, SessionUser } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Divider from '@/components/reusable/divider';
import { KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react';

interface AccountManagementProps {
  user: SessionUser;
  accounts: Account[];
  hasPassword: boolean;
}

const AccountManagement: FC<AccountManagementProps> = ({ hasPassword, accounts, user }) => {
  const router = useRouter();
  const { changePasswordSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      confirmPassword: '',
      newPassword: '',
    },
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isSubmitting, startSubmitting] = useTransition();

  const onSubmit = (values: SchemaForm<typeof changePasswordSchema>) => {
    startSubmitting(async () => {
      try {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.confirmPassword,
        });
        toast('Success - Password changed successfully!', {
          description: 'Revoking other sessions...',
        });
        setShowPasswordDialog(false);
      } catch {
        toast('Error', { description: 'Failed to change password' });
      }
    });
  };

  const handleSetPassword = async () => {
    startSubmitting(async () => {
      try {
        await requestPasswordReset(user.email);
        toast('Success', { description: 'Password reset link sent successfully' });
      } catch (error) {
        if (error instanceof Error) {
          toast('Error', { description: error.message });
        }
      }
    });
  };

  const handleDeleteAccount = () => {
    startSubmitting(async () => {
      try {
        await deleteAccount();
        toast('Success', { description: 'Account deleted successfully' });
      } catch {
        toast('Error', { description: 'Failed to delete account' });
      }
    });
  };

  const handleUnlinkAccount = (accountId: string, providerId: string) => {
    startSubmitting(async () => {
      try {
        await unlinkAccount({ accountId, providerId });
        toast('Success', { description: 'Account unlinked successfully' });
        router.refresh();
      } catch (err) {
        if (err instanceof Error) {
          toast('Error', { description: err.message });
        }
      }
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
          <h3 className='mb-4 font-semibold text-foreground'>Linked Accounts</h3>
          {accounts.length > 0 ? (
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

          <h3 className='mb-4 mt-6 font-semibold text-foreground'>
            Available Accounts for Linking
          </h3>
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
                  authClient.linkSocial({
                    provider,
                    callbackURL: '/profile?accountLinked=true&tab=account',
                  })
                }
              />
            ))}
          </div>
          <Divider />
          <h3 className='mb-4 font-semibold text-foreground'>Password Security</h3>
          <div className='rounded-lg border border-border bg-muted/30 p-4'>
            <div className='flex items-start gap-4'>
              <div
                className={`rounded-full p-2 ${hasPassword ? 'bg-green-500/10' : 'bg-amber-500/10'}`}
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
                  onClick={() => {
                    !hasPassword ? setShowPasswordDialog(true) : handleSetPassword();
                  }}
                  disabled={isSubmitting}
                  className='gap-2'
                >
                  <KeyRound className='h-4 w-4' />
                  {hasPassword ? 'Change Password' : 'Set Password'}
                </Button>
              </div>
            </div>
          </div>
          <Divider />
          <h3 className='mb-4 font-semibold text-destructive'>Danger Zone</h3>
          <Button
            variant='destructive'
            onClick={() => setShowDeleteDialog(true)}
            disabled={isSubmitting}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and new password
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form form={form} onSubmit={onSubmit} customSubmitButton>
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
          <div className='flex gap-2'>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isSubmitting} onClick={form.handleSubmit(onSubmit)}>
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-2'>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isSubmitting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isSubmitting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountManagement;
