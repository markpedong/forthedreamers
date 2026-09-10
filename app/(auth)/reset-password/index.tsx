'use client';

import { SchemaForm, TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '@/components/reusable/form-field';
import { useResetPasswordMutation } from '@/services/useMutation';

const ResetPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const mutation = useResetPasswordMutation();
  const isSubmitting = mutation.isPending;
  const { resetPasswordSchema } = formSchemas;

  const form = useForm<SchemaForm<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { register, handleSubmit } = form;
  const { errors } = form.formState;

  const onSubmit = (values: SchemaForm<typeof resetPasswordSchema>) =>
    mutation.mutate({ password: values.password });

  return (
    <AuthPage>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 sm:space-y-5">
        <FormField
          {...register('password')}
          id="reset-password"
          label="New Password"
          error={errors.password?.message}
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
        />

        <FormField
          {...register('confirmPassword')}
          id="reset-confirm-password"
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
        />

        <button type="submit" className="w-full h-11" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <button onClick={() => onNavigate('login')} className="font-medium text-primary hover:underline-offset-4">
          Sign in
        </button>
      </p>
    </AuthPage>
  );
};

export default ResetPasswordPage;
