import { Button } from '@/components/ui/button';
import Input from '@/components/reusable/input';
import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import useFormSchema from '@/hooks/useFormSchema';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { sendForgotPasswordEmail } from '@/lib/server-actions';
import { toast } from 'sonner';

const ForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const { emailSchema } = useFormSchema();
  const [isSending, startSending] = useTransition();
  const form = useForm<SchemaForm<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: SchemaForm<typeof emailSchema>) => {
    startSending(async () => {
      try {
        await sendForgotPasswordEmail(values.email);
        toast.success('Reset link sent successfully!', { duration: 2000 });
        onNavigate('login');
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        }
      }
    });
  };
  return (
    <PageWrapper>
      <div>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Reset password</h1>
          <p className='text-muted-foreground'>Enter your email to receive a reset link</p>
        </div>

        <div className='space-y-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <Input
                control={form.control}
                name='email'
                label='Forgot Email'
                placeholder='you@example.com'
                description='Must contain uppercase, lowercase, and numbers'
                disabled={isSending}
              />
              <Button className='w-full h-11'>
                {isSending ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
          </Form>
        </div>

        <div className='mt-6 text-center'>
          <button
            onClick={() => onNavigate('login')}
            className='text-sm text-muted-foreground hover:text-foreground inline-flex items-center transition-colors cursor-pointer'
          >
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Back to sign in
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
