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
import { ArrowLeft, CheckCircle } from 'lucide-react';

const sellerRegistrationSchema = z
  .object({
    storeName: z.string().min(2, 'Store name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SellerSignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const [isSigningUp, startSigningUp] = useTransition();
  const form = useForm<z.infer<typeof sellerRegistrationSchema>>({
    resolver: zodResolver(sellerRegistrationSchema),
    defaultValues: {
      storeName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof sellerRegistrationSchema>) => {
    startSigningUp(async () => {
      try {
        // Static data handling - in production, this would create a seller account
        toast.success('Account created! Please sign in.', { duration: 2000 });
        setTimeout(() => onNavigate('login'), 1000);
      } catch (error) {
        toast.error('Sign up failed');
      }
    });
  };

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-foreground mb-2'>Start Selling</h1>
        <p className='text-muted-foreground'>Create your seller account in minutes</p>
      </div>

      <div className='space-y-6'>
        <div className='bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <Form
            form={form}
            onSubmit={onSubmit}
            submitLabel={isSigningUp ? 'Creating account...' : 'Create Account'}
          >
            <div className='space-y-4'>
              <div>
                <Input
                  control={form.control}
                  name='storeName'
                  label='Store Name'
                  placeholder='My Awesome Store'
                  disabled={isSigningUp}
                />
              </div>
              <div>
                <Input
                  control={form.control}
                  name='email'
                  label='Email Address'
                  placeholder='your@email.com'
                  disabled={isSigningUp}
                  preventSpaces
                />
              </div>
              <div>
                <Input
                  control={form.control}
                  name='password'
                  label='Password'
                  type='password'
                  placeholder='••••••••'
                  disabled={isSigningUp}
                  preventSpaces
                />
              </div>
              <div>
                <Input
                  control={form.control}
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  placeholder='••••••••'
                  disabled={isSigningUp}
                  preventSpaces
                />
              </div>
            </div>
          </Form>
        </div>

        <div className='bg-secondary/50 rounded-lg p-4 border border-secondary-foreground/20 space-y-2'>
          <div className='flex items-center gap-3'>
            <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
            <span className='text-sm text-foreground'>Free to list your products</span>
          </div>
          <div className='flex items-center gap-3'>
            <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
            <span className='text-sm text-foreground'>Reach thousands of customers</span>
          </div>
          <div className='flex items-center gap-3'>
            <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
            <span className='text-sm text-foreground'>24/7 seller support included</span>
          </div>
        </div>
      </div>

      <div className='pt-6 border-t border-border'>
        <p className='text-center text-sm text-muted-foreground mb-4'>Already have an account?</p>
        <button
          onClick={() => onNavigate('login')}
          className='w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-md'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
          Sign In Instead
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

export default SellerSignUp;
