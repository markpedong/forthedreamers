'use client';

import { TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import OauthButtons from './oauth-buttons';
import FormField from '@/components/reusable/form-field';
import { Button } from '@/components/ui/button';
import Divider from '@/components/reusable/divider';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
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
  } = useSignInForm('user');

  return (
    <AuthPage>
      <AuthCard title="Welcome back" description="Sign in to your account to continue" eyebrow="For The Dreamers">
        <div className="space-y-5">
          <form onSubmit={handleSubmit(submit)} className="space-y-6">
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

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-medium text-primary underline-offset-4 hover:underline"
            type="button"
          >
            Create account
          </button>
        </p>

        <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
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
