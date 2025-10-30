import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import { Button } from '@/components/ui/button';
import OauthButtons from './oauth-buttons';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { useForm } from 'react-hook-form';
import useFormSchema from '@/hooks/useFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { signIn } from '@/lib/server-actions';
import { toast } from 'sonner';
import Divider from '@/components/reusable/divider';
import { useRouter } from 'next/navigation';

const SignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const { loginSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isSubmit, startSubmitting] = useTransition();

  const onSubmit = async (values: SchemaForm<typeof loginSchema>) => {
    startSubmitting(async () => {
      try {
        await signIn(values.email, values.password, false);
        toast.success('Sign in successfully!', { duration: 2000 });
        router.refresh()
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
          <h1 className='text-3xl font-bold mb-2'>Welcome back</h1>
          <p className='text-muted-foreground'>Sign in to your account to continue</p>
        </div>

        <div className='space-y-5'>
          <Form form={form} customSubmitButton onSubmit={onSubmit}>
            <Input
              name='email'
              label='Email'
              control={form.control}
              placeholder='you@example.com'
            />
            <Input
              name='password'
              label='Password'
              control={form.control}
              type='password'
              placeholder='••••••••'
            />
            <div className='flex items-center justify-end'>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('forgot');
                }}
                className='text-sm text-primary hover:underline cursor-pointer'
              >
                Forgot password?
              </span>
            </div>

            <Button className='w-full h-11' type='submit' disabled={isSubmit}>
              Sign in
            </Button>
          </Form>
        </div>
        <Divider title='or continue with' />
        <div className='grid grid-cols-2 gap-3'>
          <OauthButtons />
        </div>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Don't have an account?{' '}
          <button onClick={() => onNavigate('register')} className='text-primary hover:underline'>
            Create account
          </button>
        </p>
      </div>
    </PageWrapper>
  );
};

export default SignIn;
