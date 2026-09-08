'use client';

import { TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import OauthButtons from './oauth-buttons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Divider from '@/components/reusable/divider';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useSignInForm } from '@/hooks/use-sign-in-form';

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
    <PageWrapper>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>

          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="space-y-5">
          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                data-error={!!errors.email}
                className="data-[error=true]:text-destructive"
              >
                Email
              </Label>
              <Input
                {...register('email', { setValueAs: value => value.replace(/\s+/g, '') })}
                id="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                onKeyDown={event => {
                  if (event.key === ' ') event.preventDefault();
                }}
              />
              {errors.email && (
                <p id="email-error" className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password"
                data-error={!!errors.password}
                className="data-[error=true]:text-destructive"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  {...register('password', { setValueAs: value => value.replace(/\s+/g, '') })}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className="pr-10"
                  onKeyDown={event => {
                    if (event.key === ' ') event.preventDefault();
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(value => !value)}
                  onMouseDown={event => event.preventDefault()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <span
                onClick={e => {
                  e.preventDefault();

                  if (!isSubmitting) {
                    onNavigate('forgot');
                  }
                }}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                Forgot password?
              </span>
            </div>

            <Button className="w-full h-11" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>

        <Divider title="or continue with" />

        <div>
          <OauthButtons next="/profile" />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <button onClick={() => onNavigate('register')} className="text-primary hover:underline" type="button">
            Create account
          </button>
        </p>

        <Divider title="Or sign in as a seller" />

        <p className="text-center text-sm text-muted-foreground mt-4">
          Want to sell?{' '}
          <Link href="/seller" className="text-primary hover:underline font-medium">
            Click here
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default SignIn;
