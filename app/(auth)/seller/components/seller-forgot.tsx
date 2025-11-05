'use client';

import type { SchemaForm, TOnNavigate } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import Input from '@/components/reusable/input';
import Form from '@/components/reusable/form';
import useFormSchema from '@/hooks/useFormSchema';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SellerForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const { forgotPasswordSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: SchemaForm<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      toast.success('Check your email for reset link', { duration: 2000 });
      setTimeout(() => onNavigate('login'), 1500);
    });
  };

  return (
    <div className='flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className='w-full max-w-md'
      >
        <Card className='border-border bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-semibold mb-1'>Reset Password</CardTitle>
            <CardDescription>Enter your email and we’ll send you a reset link.</CardDescription>
          </CardHeader>

          <CardContent>
            <Form
              form={form}
              submitLabel={isPending ? 'Sending...' : 'Send reset link'}
              onSubmit={onSubmit}
            >
              <Input
                name='name'
                type='email'
                placeholder='your@email.com'
                disabled={isPending}
                autoComplete='email'
              />
            </Form>

            <Button
              variant='link'
              onClick={() => onNavigate('login')}
              className='text-sm text-primary hover:underline flex items-center justify-center gap-1 mt-3'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SellerForgotPasswordPage;
