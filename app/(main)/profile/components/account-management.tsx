'use client';

import AccountCard from '@/components/reusable/account-card';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OAUTH_PROVIDERS } from '@/constants';
import { authClient } from '@/lib/auth-client';
import { changePassword, deleteAccount, signOut, unlinkAccount } from '@/lib/server-actions';
import { Account, SessionUser } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { FC, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface AccountManagementProps {
  user: SessionUser;
  accounts: Account[];
}

const AccountManagement: FC<AccountManagementProps> = ({ user, accounts }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [isPending, startTransition] = useTransition();

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast('Error', { description: 'Passwords do not match' });
      return;
    }

    startTransition(async () => {
      try {
        await changePassword({
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
        });
        toast('Success', { description: 'Password changed successfully' });
        setShowPasswordDialog(false);
        setPasswordData({ current: '', new: '', confirm: '' });
      } catch {
        toast('Error', { description: 'Failed to change password' });
      }
    });
  };

  const handleDeleteAccount = () => {
    startTransition(async () => {
      try {
        await deleteAccount();
        toast('Success', { description: 'Account deleted successfully' });
      } catch {
        toast('Error', { description: 'Failed to delete account' });
      }
    });
  };

  const handleUnlinkAccount = (accountId: string, providerId: string) => {
    startTransition(async () => {
      try {
        console.log("Unlinking account", accountId, providerId);
        await unlinkAccount({ accountId, providerId });
        toast('Success', { description: 'Account unlinked successfully' });
        router.refresh();
      } catch (err) {
        toast('Error', { description: 'Failed to unlink account' });
      }
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await signOut();
      } catch {
        toast('Error', { description: 'Failed to logout' });
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
          {/* Linked Accounts */}
          <h3 className='mb-4 font-semibold text-foreground'>Linked Accounts</h3>
          {accounts.length > 0 ? (
            <div className='space-y-2'>
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  provider={account.providerId}
                  account={account}
                  loading={isPending}
                  onClick={(provider) => handleUnlinkAccount(account.accountId, provider)}
                />
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No linked accounts</p>
          )}

          {/* Available Accounts */}
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
                loading={isPending}
                onClick={(provider) =>
                  authClient.linkSocial({
                    provider,
                    callbackURL: '/profile',
                  })
                }
              />
            ))}
          </div>

          {/* Change Password */}
          <div className='border-t border-border pt-6'>
            <h3 className='mb-4 font-semibold text-foreground'>Security</h3>
            <Button
              variant='outline'
              onClick={() => setShowPasswordDialog(true)}
              disabled={isPending}
            >
              Change Password
            </Button>
          </div>

          {/* Logout */}
          <div className='border-t border-border pt-6'>
            <Button variant='outline' onClick={handleLogout} disabled={isPending}>
              Logout
            </Button>
          </div>

          {/* Delete Account */}
          <div className='border-t border-border pt-6'>
            <h3 className='mb-4 font-semibold text-destructive'>Danger Zone</h3>
            <Button
              variant='destructive'
              onClick={() => setShowDeleteDialog(true)}
              disabled={isPending}
            >
              Delete Account
            </Button>
          </div>
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
          <div className='space-y-4'>
            {['current', 'new', 'confirm'].map((field) => (
              <div key={field} className='space-y-2'>
                <Label htmlFor={`${field}-password`}>
                  {field === 'current'
                    ? 'Current Password'
                    : field === 'new'
                      ? 'New Password'
                      : 'Confirm Password'}
                </Label>
                <Input
                  id={`${field}-password`}
                  type='password'
                  value={passwordData[field as keyof typeof passwordData]}
                  onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangePassword} disabled={isPending}>
              {isPending ? 'Changing...' : 'Change Password'}
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
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isPending ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountManagement;
