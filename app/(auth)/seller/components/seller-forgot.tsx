'use client';

import type { SchemaForm, TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import Input from '@/components/reusable/input';
import Form from '@/components/reusable/form';
import formSchemas from '@/hooks/form-schemas';
import { ArrowLeft, Mail } from 'lucide-react';
import AuthCard from '../../components/auth-card';

const SellerForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const { forgotPasswordSchema } = formSchemas;
  const form = useForm<SchemaForm<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = async () => {
    startTransition(async () => {
      toast.success('Check your email for reset link', { duration: 2000 });
      setTimeout(() => onNavigate('login'), 1500);
    });
  };

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we’ll send you a secure reset link."
      icon={<Mail className="size-5" />}
    >
      <Form form={form} submitLabel={isPending ? 'Sending...' : 'Send reset link'} onSubmit={onSubmit}>
        <Input name="name" type="email" placeholder="your@email.com" disabled={isPending} autoComplete="email" />
      </Form>

      <button
        type="button"
        onClick={() => onNavigate('login')}
        className="mx-auto mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </button>
    </AuthCard>
  );
};

export default SellerForgotPasswordPage;
