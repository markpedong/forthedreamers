'use client';

import type { SchemaForm, TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle } from 'lucide-react';

import formSchemas from '@/hooks/form-schemas';
import FormField from '@/components/reusable/form-field';
import { useSellerSignUpMutation } from '@/services/useMutation';
import Link from 'next/link';
import AuthCard from '../../components/auth-card';

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

  const { register, handleSubmit } = form;
  const { errors } = form.formState;

  const onSubmit = (values: SchemaForm<typeof createSellerSchema>) => {
    mutation.mutate(values);
  };

  return (
    <AuthCard title="Start selling" description="Create your seller account and set up your storefront." eyebrow="Seller hub">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField {...register('storeName')} id="seller-signup-store" label="Store Name" error={errors.storeName?.message} placeholder="My Awesome Store" disabled={isSubmitting} />
        <FormField {...register('name')} id="seller-signup-name" label="Name" error={errors.name?.message} placeholder="John Doe" disabled={isSubmitting} />
        <FormField {...register('email')} id="seller-signup-email" label="Email" error={errors.email?.message} type="email" placeholder="your@email.com" disabled={isSubmitting} autoComplete="email" />
        <FormField {...register('password')} id="seller-signup-password" label="Password" error={errors.password?.message} type="password" placeholder="••••••••" disabled={isSubmitting} autoComplete="new-password" />
        <FormField {...register('confirmPassword')} id="seller-signup-confirm" label="Confirm Password" error={errors.confirmPassword?.message} type="password" placeholder="••••••••" disabled={isSubmitting} autoComplete="new-password" />

        <button type="submit" className="w-full h-11" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-5 grid gap-2 rounded-xl border border-white/50 bg-white/35 p-4 dark:border-white/10 dark:bg-white/5">
        {['Free to list your products', 'Reach thousands of customers', '24/7 seller support included'].map(benefit => (
          <div key={benefit} className="flex items-center gap-3">
            <CheckCircle className="size-4 shrink-0 text-primary" />
            <span className="text-sm text-foreground">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t border-foreground/10 pt-5 text-center text-sm text-muted-foreground">
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
    </AuthCard>
  );
};

export default SellerSignUp;
