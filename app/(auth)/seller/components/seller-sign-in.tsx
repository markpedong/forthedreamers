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
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { getUserDB, signIn } from '@/lib/server-actions';
import { USER_ROLE } from '@/generated/prisma';
import { tryWithToast } from '@/utils/helper';
import { useAppDispatch } from '@/redux/store';
import { setSessionData } from '@/redux/features/appSlice';
import { authClient } from '@/lib/auth-client';
import useWithDispatch from '@/hooks/useWithDispatch';
import Link from 'next/link';

const SellerSignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();
  const { loginSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const { signOut } = useWithDispatch();

  const onSubmit = (values: SchemaForm<typeof loginSchema>) => {
    startTransition(async () => {
      const result = await tryWithToast(signIn(values.email, values.password, false));
      if (!result) return;

      const user = await getUserDB(`${result?.user.id}`);
      if (user?.role === USER_ROLE.USER) {
        await signOut();
        router.refresh();
        toast.error('You are not authorized to access this page, please use the user panel.', {
          duration: 5000,
        });
        return;
      }

      router.push('/dashboard');
      const session = await authClient.getSession();
      dispatch(setSessionData(session.data));

      toast.success('Logged in successfully!', { duration: 3000 });
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
                type='button'
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

      <p className='w-full  text-center text-sm text-muted-foreground mt-4'>
        Want to buy things?{' '}
        <Link href='/sign-in' className='text-primary hover:underline font-medium'>
          Click here
        </Link>
      </p>
    </div>
  );
};

export default SellerSignIn;
