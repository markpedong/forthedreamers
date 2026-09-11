'use client';

import type { SchemaForm, TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';

import formSchemas from '@/hooks/form-schemas';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { useSellerSignUpMutation } from '@/services/useMutation';
import Link from 'next/link';
import AuthPage from '../../components/auth-page';

const SellerSignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const mutation = useSellerSignUpMutation();
  const isSubmitting = mutation.isPending;
  const { createSellerSchema } = formSchemas;

  const form = useForm<SchemaForm<typeof createSellerSchema>>({
    resolver: zodResolver(createSellerSchema),
    defaultValues: {
      storeName: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SchemaForm<typeof createSellerSchema>) => {
    mutation.mutate(values);
  };

  return (
    <AuthPage>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Seller hub</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Start selling</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Create your seller account and set up your storefront.
      </p>

      <Form
        className="mt-6 space-y-4"
        form={form}
        onSubmit={onSubmit}
        submitLabel="Create account"
        isSending={isSubmitting}
      >
        <Input label="Store Name" name="storeName" placeholder="My Awesome Store" disabled={isSubmitting} />
        <Input name="name" label="Name" placeholder="John Doe" disabled={isSubmitting} />
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          disabled={isSubmitting}
          autoComplete="email"
        />
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
          autoComplete="new-password"
          label="Password"
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
          autoComplete="new-password"
          label="Confirm Password"
        />
      </Form>

      <div className="mt-5 grid gap-2 rounded-xl border border-white/50 bg-white/35 p-4 dark:border-white/10 dark:bg-white/5">
        {['Free to list your products', 'Reach thousands of customers', '24/7 seller support included'].map(benefit => (
          <div key={benefit} className="flex items-center gap-3">
            <CheckCircle className="size-4 shrink-0 text-primary" />
            <span className="text-sm text-foreground">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2.5 text-center text-sm text-muted-foreground">
        <p>
          Already have a seller account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </button>
        </p>
        <p>
          Shopping instead?{' '}
          <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
            Customer sign in
          </Link>
        </p>
      </div>
    </AuthPage>
  );
};

export default SellerSignUp;
