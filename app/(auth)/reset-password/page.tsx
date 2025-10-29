'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import useFormSchema from '@/hooks/useFormSchema';
import Input from '@/components/reusable/input';
import { SchemaForm } from '@/lib/types';
import { resetPassword } from '@/lib/server-actions';

const Page = () => {
  const router = useRouter();
  const { resetPasswordSchema } = useFormSchema();
  const [isLoading, startTransition] = useTransition();
  const form = useForm<SchemaForm<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SchemaForm<typeof resetPasswordSchema>) => {
    startTransition(async () => {
      try {
        await resetPassword('', values.password);
        toast.success('Password reset successfully!');
        router.push('/sign-in');
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        }
      }
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <Card className='border shadow-lg'>
          <CardHeader className='space-y-2'>
            <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below. It must be at least 8 characters and contain uppercase,
              lowercase, and numbers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <Input
                  control={form.control}
                  name='password'
                  type='password'
                  label='New Password'
                  description='Must contain uppercase, lowercase, and numbers'
                  placeholder='Enter your new password'
                  disabled={isLoading}
                />
                <Input
                  control={form.control}
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  placeholder='Confirm your new password'
                  disabled={isLoading}
                  description='Passwords must match'
                />
                <Button type='submit' className='w-full' disabled={isLoading} aria-busy={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          Remember your password?{' '}
          <a href='/sign-in' className='font-medium text-primary hover:underline'>
            Sign in instead
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
