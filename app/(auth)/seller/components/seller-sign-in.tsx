'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import type { SchemaForm, TOnNavigate } from '@/lib/types';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useFormSchema from '@/hooks/useFormSchema';
import { signIn } from '@/lib/server-actions';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';

const SellerSignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();
  const { loginSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: SchemaForm<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        const res = await signIn(values.email, values.password, false);
        console.log('res', res);

        toast.success('Logged in successfully!', { duration: 3000 });
        router.refresh();
      } catch {
        toast.error('Sign in failed. Please try again.');
      }
    });
  };

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-foreground mb-2'>Welcome Back</h1>
        <p className='text-muted-foreground'>Sign in to manage your store and track sales.</p>
      </div>

      <Card className='border-border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200'>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your seller account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            form={form}
            onSubmit={onSubmit}
            submitLabel={isSubmitting ? 'Signing in...' : 'Sign In'}
          >
            <Input
              name='email'
              placeholder='your@email.com'
              disabled={isSubmitting}
              autoComplete='email'
              preventSpaces
              label='Email'
            />
            <Input
              name='password'
              type='password'
              placeholder='••••••••'
              disabled={isSubmitting}
              preventSpaces
              label='Password'
            />
            <div className='flex justify-end items-center w-full text-end'>
              <Button
                variant='link'
                className='text-primary text-sm font-medium'
                onClick={() => onNavigate('forgot')}
              >
                Forgot password?
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      <div className='pt-6 border-t border-border text-center'>
        <p className='text-sm text-muted-foreground mb-4'>Don’t have an account?</p>
        <Button
          onClick={() => onNavigate('register')}
          className='w-full flex items-center justify-center gap-2 group'
          variant='secondary'
        >
          Create Seller Account
          <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
        </Button>
      </div>

      <div className='pt-4 text-center'>
        <Button
          variant='link'
          className='text-sm font-medium underline text-primary hover:text-secondary'
          onClick={() => router.push('/sign-in')}
        >
          Want to buy things? Click here
        </Button>
      </div>
    </div>
  );
};

export default SellerSignIn;
