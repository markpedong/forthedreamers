'use client';

import type { SchemaForm, TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useFormSchema from '@/hooks/useFormSchema';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import Divider from '@/components/reusable/divider';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/server-actions';

const SellerSignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();
  const { createSellerSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof createSellerSchema>>({
    resolver: zodResolver(createSellerSchema),
    defaultValues: {
      storeName: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SchemaForm<typeof createSellerSchema>) => {
    startTransition(async () => {
      try {
        const res = await signUp(values.email, values.password, values.name);

      } catch {
        toast.error('Sign up failed. Please try again.');
      }
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className='w-full max-w-md'
      >
        <Card className='border-border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200'>
          <CardHeader>
            <CardTitle className='text-3xl font-bold'>Start Selling</CardTitle>
            <CardDescription>Create your seller account in minutes</CardDescription>
          </CardHeader>

          <CardContent>
            <Form
              form={form}
              onSubmit={onSubmit}
              submitLabel={isSubmitting ? 'Creating account...' : 'Create Account'}
            >
              <Input
                label='Store Name'
                name='storeName'
                placeholder='My Awesome Store'
                disabled={isSubmitting}
              />
              <Input name='name' label='Name' placeholder='John Doe' disabled={isSubmitting} />
              <Input
                name='email'
                label='Email'
                type='email'
                placeholder='your@email.com'
                disabled={isSubmitting}
                autoComplete='email'
              />

              <Input
                name='password'
                type='password'
                placeholder='••••••••'
                disabled={isSubmitting}
                autoComplete='new-password'
                label='Password'
              />
              <Input
                name='confirmPassword'
                type='password'
                placeholder='••••••••'
                disabled={isSubmitting}
                autoComplete='new-password'
                label='Confirm Password'
              />
            </Form>

            <div className='mt-6 bg-secondary/50 rounded-lg p-4 border border-secondary-foreground/20 space-y-2'>
              {[
                'Free to list your products',
                'Reach thousands of customers',
                '24/7 seller support included',
              ].map((benefit, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
                  <span className='text-sm text-foreground'>{benefit}</span>
                </div>
              ))}
            </div>
            <Divider />
            <p className='text-center text-sm text-muted-foreground mb-4'>
              Already have an account?
            </p>
            <Button
              variant='secondary'
              onClick={() => onNavigate('login')}
              className='w-full flex items-center justify-center gap-2 group'
            >
              <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
              Sign In Instead
            </Button>
            <div className='pt-4'>
              <Button
                variant='link'
                onClick={() => router.push('/sign-in')}
                className='w-full text-sm text-primary underline'
              >
                Want to buy things? Click here
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SellerSignUp;
