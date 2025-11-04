'use client';

import type { TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Input from '@/components/reusable/input';
import Form from '@/components/reusable/form';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';

const sellerLoginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const SellerSignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof sellerLoginSchema>>({
    resolver: zodResolver(sellerLoginSchema),
    defaultValues: { email: '', password: '' },
  });
  const [isSubmitting, startSubmitting] = useTransition();

  const onSubmit = async (values: z.infer<typeof sellerLoginSchema>) => {
    startSubmitting(async () => {
      try {
        if (values.email === 'seller@example.com' && values.password === 'password') {
          toast.success('Welcome back!', { duration: 2000 });
          setTimeout(() => onNavigate('2fa'), 300);
        } else {
          toast.error('Invalid email or password');
        }
      } catch (error) {
        toast.error('Sign in failed');
      }
    });
  };

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-foreground mb-2'>Welcome Back</h1>
        <p className='text-muted-foreground'>Sign in to manage your store and track sales</p>
      </div>

      <div className='bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
        <Form
          form={form}
          onSubmit={onSubmit}
          submitLabel={isSubmitting ? 'Signing in...' : 'Sign In'}
        >
          <Input
            name='email'
            label='Email Address'
            placeholder='your@email.com'
            disabled={isSubmitting}
            preventSpaces
          />
          <Input
            name='password'
            label='Password'
            type='password'
            placeholder='••••••••'
            disabled={isSubmitting}
            preventSpaces
          />
        </Form>
      </div>

      <button
        onClick={() => onNavigate('forgot')}
        className='w-full text-sm text-primary font-medium hover:text-accent transition-colors duration-200 py-2'
      >
        Forgot password?
      </button>

      <div className='pt-6 border-t border-border'>
        <p className='text-center text-sm text-muted-foreground mb-4'>Don't have an account?</p>
        <button
          onClick={() => onNavigate('register')}
          className='w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-md'
        >
          Create Seller Account
          <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
        </button>
      </div>

      <div className='pt-4'>
        <button
          onClick={() => (window.location.href = '/')}
          className='w-full text-sm font-medium text-primary hover:text-accent transition-colors duration-200 py-2 underline'
        >
          Want to buy things? Click here
        </button>
      </div>
    </div>
  );
};

export default SellerSignIn;
