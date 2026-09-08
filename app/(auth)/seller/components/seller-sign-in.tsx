'use client';

import { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import type { TOnNavigate } from '@/lib/types';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Link from 'next/link';
import { useSignInForm } from '@/hooks/use-sign-in-form';

const SellerSignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    submit,
  } = useSignInForm('seller');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>

        <p className="text-muted-foreground">Sign in to manage your store and track sales.</p>
      </div>

      <Card className="border-border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>

          <CardDescription>Enter your credentials to access your seller account.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <div className="grid gap-2">
              <Label
                htmlFor="seller-email"
                data-error={!!errors.email}
                className="data-[error=true]:text-destructive"
              >
                Email
              </Label>
              <Input
                {...register('email', { setValueAs: value => value.replace(/\s+/g, '') })}
                id="seller-email"
                placeholder="your@email.com"
                disabled={isSubmitting}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'seller-email-error' : undefined}
                onKeyDown={event => {
                  if (event.key === ' ') event.preventDefault();
                }}
              />
              {errors.email && (
                <p id="seller-email-error" className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="seller-password"
                data-error={!!errors.password}
                className="data-[error=true]:text-destructive"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  {...register('password', { setValueAs: value => value.replace(/\s+/g, '') })}
                  id="seller-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'seller-password-error' : undefined}
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
                <p id="seller-password-error" className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end items-center w-full text-end">
              <Button
                variant="link"
                className="text-primary text-sm font-medium"
                onClick={() => onNavigate('forgot')}
                type="button"
                disabled={isSubmitting}
              >
                Forgot password?
              </Button>
            </div>

            <Button className="w-full h-11">{isSubmitting ? 'Signing in...' : 'Sign In'}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground mb-4">Don&apos;t have an account?</p>

        <Button
          onClick={() => onNavigate('register')}
          className="w-full flex items-center justify-center gap-2 group"
          variant="secondary"
          disabled={isSubmitting}
        >
          Create Seller Account
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <p className="w-full text-center text-sm text-muted-foreground mt-4">
        Want to buy things?{' '}
        <Link href="/sign-in" className="text-primary hover:underline font-medium">
          Click here
        </Link>
      </p>
    </div>
  );
};

export default SellerSignIn;
