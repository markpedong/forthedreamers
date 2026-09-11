'use client';

import type { SchemaForm, TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import FormField from '@/components/reusable/form-field';
import formSchemas from '@/hooks/form-schemas';
import { ArrowLeft } from 'lucide-react';
import AuthPage from '../../components/auth-page';

import { Button } from '@/components/reusable/button';

const SellerForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const { forgotPasswordSchema } = formSchemas;
  const [isPending, startTransition] = useTransition();

  const form = useForm<SchemaForm<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { register, handleSubmit } = form;
  const { errors } = form.formState;

  const onSubmit = async () => {
    startTransition(async () => {
      toast.success('Check your email for reset link', { duration: 2000 });
      setTimeout(() => onNavigate('login'), 1500);
    });
  };

  return (
    <AuthPage>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset your password</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Enter your email and we&apos;ll send you a secure reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormField {...register('email')} id="seller-forgot-email" label="Email" error={errors.email?.message} type="email" placeholder="your@email.com" disabled={isPending} autoComplete="email" />

        <Button type="submit" className="w-full h-11" loading={isPending} title="Send reset link" />
      </form>

      <button
        type="button"
        onClick={() => onNavigate('login')}
        className="mx-auto mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </button>
    </AuthPage>
  );
};

export default SellerForgotPasswordPage;
