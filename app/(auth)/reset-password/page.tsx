'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useFormSchema from '@/hooks/useFormSchema';
import z from 'zod';

const Page = () => {
  const { resetPasswordSchema } = useFormSchema();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: values.password }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || 'Failed to reset password');
        return;
      }

      toast.success('Password reset successfully!');
      router.push('/sign-in');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='password'>New Password</FormLabel>
                      <FormControl>
                        <Input
                          id='password'
                          type='password'
                          placeholder='Enter your new password'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Must contain uppercase, lowercase, and numbers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          id='confirmPassword'
                          type='password'
                          placeholder='Confirm your new password'
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Passwords must match</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
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
