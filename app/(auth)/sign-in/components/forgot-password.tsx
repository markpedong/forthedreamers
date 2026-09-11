import { SchemaForm, TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '@/components/reusable/form-field';
import { useForgotPasswordMutation } from '@/services/useMutation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/reusable/button';

const ForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const { forgotPasswordSchema } = formSchemas;
  const mutation = useForgotPasswordMutation({ onSuccess: () => onNavigate('login'), duration: 2000 });
  const isSending = mutation.isPending;

  const form = useForm<SchemaForm<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { register, handleSubmit } = form;
  const { errors } = form.formState;

  const onSubmit = (values: SchemaForm<typeof forgotPasswordSchema>) => mutation.mutate(values.email);

  return (
    <AuthPage>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Enter your email and we&apos;ll send you a secure reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 sm:space-y-5">
        <FormField
          {...register('email')}
          id="forgot-email"
          label="Email"
          error={errors.email?.message}
          placeholder="you@example.com"
          disabled={isSending}
        />

        <Button type="submit" className="w-full h-11" loading={isSending} title="Send reset link" />
      </form>

      <div className="mt-5 text-center">
        <button
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </button>
      </div>
    </AuthPage>
  );
};

export default ForgotPasswordPage;
