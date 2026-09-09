'use client';

import { TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import OauthButtons from './oauth-buttons';
import FormField from '@/components/reusable/form-field';
import { Button } from '@/components/ui/button';
import Divider from '@/components/reusable/divider';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useSignInForm } from '@/hooks/use-sign-in-form';
import AuthCard from '../../components/auth-card';

const SignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    submit,
  } = useSignInForm('customer');

  return (
    <AuthPage>
      <Link
        href="/"
        className="fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <AuthCard title="Welcome back" description="Sign in to your account to continue" eyebrow="For The Dreamers">
        <div className="space-y-3 sm:space-y-5">
          <form onSubmit={handleSubmit(submit)} className="space-y-3 sm:space-y-5">
            <FormField
              {...register('email', { setValueAs: value => value.replace(/\s+/g, '') })}
              id="email"
              label="Email"
              error={errors.email?.message}
              placeholder="you@example.com"
              disabled={isSubmitting}
              onKeyDown={event => {
                if (event.key === ' ') event.preventDefault();
              }}
            />

            <FormField
              {...register('password', { setValueAs: value => value.replace(/\s+/g, '') })}
              id="password"
              label="Password"
              error={errors.password?.message}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="pr-10"
              onKeyDown={event => {
                if (event.key === ' ') event.preventDefault();
              }}
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

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();

                  if (!isSubmitting) {
                    onNavigate('forgot');
                  }
                }}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>

        <Divider title="or continue with" />

        <OauthButtons next="/profile" />

        <p className="mt-3 text-center text-sm text-muted-foreground sm:mt-5">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-medium text-primary underline-offset-4 hover:underline"
            type="button"
          >
            Create account
          </button>
        </p>

        <div className="mt-3 border-t pt-3 text-center text-sm text-muted-foreground sm:mt-5 sm:pt-5">
          Want to sell?{' '}
          <Link href="/seller" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in as a seller
          </Link>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default SignIn;
