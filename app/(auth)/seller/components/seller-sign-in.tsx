'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { TOnNavigate } from '@/lib/types';

import { Button } from '@/components/ui/button';
import FormField from '@/components/reusable/form-field';
import AuthPage from '../../components/auth-page';

import Link from 'next/link';
import { useSignInForm } from '@/hooks/use-sign-in-form';

const SellerSignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    mutation,
  } = useSignInForm('dashboard');

  const onSubmit = handleSubmit(({ email, password }) => {
    mutation.mutate({ email, password });
  });

  return (
    <AuthPage>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Seller hub</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Sign in to manage your store and track sales.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <FormField
          {...register('email')}
          id="seller-email"
          label="Email"
          error={errors.email?.message}
          placeholder="your@email.com"
          disabled={isSubmitting}
          autoComplete="email"
        />

        <FormField
          {...register('password')}
          id="seller-password"
          label="Password"
          error={errors.password?.message}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          disabled={isSubmitting}
          className="pr-10"
          autoComplete="current-password"
        >
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(value => !value)}
            onMouseDown={event => event.preventDefault()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </FormField>

        <div className="text-right">
          <button
            type="button"
            onClick={() => onNavigate('forgot')}
            disabled={isSubmitting}
            className="text-sm font-medium text-primary underline underline-offset-4 hover:underline-offset-4"
          >
            Forgot password?
          </button>
        </div>

        <Button className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-5 space-y-2.5 text-center text-sm text-muted-foreground">
        <p>
          New to selling?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-medium text-primary underline-offset-4 hover:underline"
            disabled={isSubmitting}
          >
            Create a seller account
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

export default SellerSignIn;
