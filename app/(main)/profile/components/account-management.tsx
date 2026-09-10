'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react';
import { CHANGE_PASSWORD_DEFAULT, OAUTH_PROVIDERS } from '@/constants';
import formSchemas from '@/hooks/form-schemas';
import { Account, SchemaForm } from '@/lib/types';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import Divider from '@/components/reusable/divider';
import AccountCard from '@/components/reusable/account-card';
import AlertDialog from '@/components/reusable/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/redux/store';
import {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLinkSocialMutation,
} from '@/services/useMutation';

interface AccountManagementProps {
  accounts: Account[];
  hasPassword: boolean;
}

const AccountManagement: FC<AccountManagementProps> = ({ hasPassword, accounts }) => {
  const user = useAppSelector(state => state.userData.data);
  const { changePasswordSchema } = formSchemas;
  const form = useForm<SchemaForm<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: CHANGE_PASSWORD_DEFAULT,
  });

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const passwordMutation = useChangePasswordMutation(() => {
    form.reset(CHANGE_PASSWORD_DEFAULT);
    setShowPasswordDialog(false);
  });
  const resetMutation = useForgotPasswordMutation({
    redirectTo: '/reset-password',
    successMessage: 'Password reset link sent successfully',
  });
  const linkMutation = useLinkSocialMutation();
  const isSubmitting = passwordMutation.isPending || resetMutation.isPending || linkMutation.isPending;

  const onSubmit = (values: SchemaForm<typeof changePasswordSchema>) => {
    passwordMutation.mutate(values.confirmPassword);
  };

  const handleSetPassword = () => {
    if (user?.email) resetMutation.mutate(user.email);
  };

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Sign-in methods</CardTitle>
          <CardDescription>Manage your password and linked accounts.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <section>
            <p className="mb-3 text-sm font-medium text-foreground">Linked accounts</p>
            {accounts.length ? (
              <div className="space-y-2">
                {accounts.map(account => (
                  <AccountCard
                    key={account.id}
                    provider={account.providerId}
                    account={account}
                    loading={isSubmitting}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No linked accounts</p>
            )}
          </section>

          <section>
            <p className="mb-3 text-sm font-medium text-foreground">Available to link</p>
            <div className="grid gap-3">
              {OAUTH_PROVIDERS.filter(provider => !accounts.some(a => a.providerId === provider)).map(provider => (
                <AccountCard
                  key={provider}
                  provider={provider}
                  account={null}
                  loading={isSubmitting}
                  onClick={provider => linkMutation.mutate(provider)}
                />
              ))}
            </div>
          </section>

          <Divider />

          <section className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-2 ${hasPassword ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                {hasPassword ? (
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-medium text-foreground">
                    {hasPassword ? 'Password Protection Active' : 'No Password Set'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hasPassword
                      ? 'Your account is secured with a password. You can update it anytime.'
                      : 'Set a password to secure your account and enable additional login options.'}
                  </p>
                </div>

                <Button
                  variant={hasPassword ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => (hasPassword ? setShowPasswordDialog(true) : handleSetPassword())}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <KeyRound className="h-4 w-4" />
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
        title="Change Password"
        description="Enter your current and new password."
        confirmText="Change Password"
        loading={isSubmitting}
        onConfirm={form.handleSubmit(onSubmit)}
        onCancel={() => form.reset(CHANGE_PASSWORD_DEFAULT)}
      >
        <Form form={form} onSubmit={onSubmit} customSubmitButton className="mt-8">
          <Input
            control={form.control}
            name="currentPassword"
            label="Current Password"
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          <Input
            control={form.control}
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
          <Input
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
        </Form>
      </AlertDialog>
    </>
  );
};

export default AccountManagement;
