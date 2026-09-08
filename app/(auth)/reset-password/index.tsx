'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '@/components/reusable/form';
import formSchemas from '@/hooks/form-schemas';
import Input from '@/components/reusable/input';
import { SchemaForm } from '@/lib/types';
import { useResetPasswordMutation } from '@/services/useMutation';
import AuthPage from '../components/auth-page';
import AuthCard from '../components/auth-card';
import { KeyRound } from 'lucide-react';

const ResetPassword: FC<{ token: string }> = ({ token }) => {
  const { resetPasswordSchema } = formSchemas;
  const mutation = useResetPasswordMutation(token);
  const isLoading = mutation.isPending;
  const form = useForm<SchemaForm<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SchemaForm<typeof resetPasswordSchema>) => mutation.mutate(values.password);

  return (
    <AuthPage>
      <AuthCard
        title="Choose a new password"
        description="Use at least 8 characters with uppercase, lowercase, and numbers."
        icon={<KeyRound className="size-5" />}
      >
            <Form form={form} onSubmit={onSubmit} submitLabel={isLoading ? 'Resetting...' : 'Reset Password'}>
              <Input
                control={form.control}
                name="password"
                type="password"
                label="New Password"
                description="Must contain uppercase, lowercase, and numbers"
                placeholder="Enter your new password"
                disabled={isLoading}
              />
              <Input
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your new password"
                disabled={isLoading}
                description="Passwords must match"
              />
            </Form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <a href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in instead
          </a>
        </p>
      </AuthCard>
    </AuthPage>
  );
};

export default ResetPassword;
