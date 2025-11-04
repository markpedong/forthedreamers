'use client';

import type { TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import Input from '@/components/reusable/input';
import Form from '@/components/reusable/form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

const SellerForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      try {
        toast.success('Check your email for reset link', { duration: 2000 });
        setTimeout(() => onNavigate('login'), 1500);
      } catch (error) {
        toast.error('Failed to send reset email');
      }
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <div className='w-full max-w-md'>
        <div className='space-y-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold mb-1'>Reset Password</h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <Form
            form={form}
            onSubmit={onSubmit}
            submitLabel={isPending ? 'Sending...' : 'Send Reset Link'}
          >
            <Input
              control={form.control}
              name='email'
              label='Email'
              placeholder='your@email.com'
              disabled={isPending}
              preventSpaces
            />
          </Form>

          <div className='text-center'>
            <button
              onClick={() => onNavigate('login')}
              className='text-sm text-primary hover:underline'
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerForgotPasswordPage;
