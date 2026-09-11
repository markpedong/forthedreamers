'use client';

import { TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import OauthButtons from './oauth-buttons';
import FormField from '@/components/reusable/form-field';
import { Button } from '@/components/reusable/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useSignInForm } from '@/hooks/use-sign-in-form';

const SignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    mutation,
  } = useSignInForm('customer');

  const onSubmit = handleSubmit(({ email, password }) => {
    mutation.mutate({ email, password });
  });

  return (
    <AuthPage>
      {/* Desktop: heading + form */}
      <div className="hidden lg:block">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back 👋</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Today is a new day. It's your day. You shape it. Sign in to start managing your projects.
        </p>
      </div>

      {/* Mobile: heading + form below banner */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back 👋</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Today is a new day. It's your day. You shape it. Sign in to start managing your projects.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 lg:mt-8">
        <FormField
          {...register('email')}
          id="email"
          label="Email"
          error={errors.email?.message}
          placeholder="Example@email.com"
          disabled={isSubmitting}
          autoComplete="email"
        />

        <FormField
          {...register('password')}
          id="password"
          label="Password"
          error={errors.password?.message}
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 8 characters"
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
            onClick={e => {
              e.preventDefault();

              if (!isSubmitting) {
                onNavigate('forgot');
              }
            }}
            className="text-sm font-medium text-primary underline hover:underline-offset-4"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting} title="Sign in" />

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">Or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <OauthButtons next="/profile" />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t you have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-medium text-primary hover:underline-offset-4"
            type="button"
          >
            Sign up
          </button>
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Selling on For The Dreamers?{' '}
          <Link href="/seller" className="font-medium text-primary hover:underline-offset-4">
            Seller sign in
          </Link>
        </p>

      </form>

      <p className="mt-16 text-center text-xs text-muted-foreground lg:mt-24">
        © 2023 ALL RIGHTS RESERVED
      </p>
    </AuthPage>
  );
};

export default SignIn;
