'use client';

import { FC, useState, useTransition } from 'react';
import type { SessionUser, Account } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { changePassword, deleteAccount, unlinkAccount, signOut } from '@/lib/server-actions';

interface AccountManagementProps {
  user: SessionUser;
  accounts: Account[];
}

const AccountManagement: FC<AccountManagementProps> = ({ user, accounts }) => {
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
        await changePassword(user.id, passwordData.current, passwordData.new);
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
        await deleteAccount(user.id);
        toast('Success', { description: 'Account deleted successfully' });
      } catch {
        toast('Error', { description: 'Failed to delete account' });
      }
    });
  };

  const handleUnlinkAccount = (accountId: string) => {
    startTransition(async () => {
      try {
        await unlinkAccount(accountId);
        toast('Success', { description: 'Account unlinked successfully' });
      } catch {
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
          <div>
            <h3 className='mb-4 font-semibold text-foreground'>Linked Accounts</h3>
            {accounts.length > 0 ? (
              <div className='space-y-2'>
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className='flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3'
                  >
                    <div>
                      <p className='font-medium text-foreground capitalize'>{account.providerId}</p>
                      <p className='text-sm text-muted-foreground'>{account.accountId}</p>
                    </div>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleUnlinkAccount(account.id)}
                      disabled={isPending}
                    >
                      Unlink
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>No linked accounts</p>
            )}
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
