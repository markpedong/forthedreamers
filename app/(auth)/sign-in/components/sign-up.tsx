import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import { Button } from '@/components/ui/button';
import OauthButtons from './oauth-buttons';
import useFormSchema from '@/hooks/useFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/reusable/input';
import { useTransition } from 'react';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { signUp } from '@/lib/server-actions';

const SignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const [isSigningUp, startSigningUp] = useTransition();
  const { registrationSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SchemaForm<typeof registrationSchema>) => {
    startSigningUp(async () => {
      try {
        await signUp(values.email, values.password, values.name);
        onNavigate('login');
        toast.success('Account created successfully!', { duration: 3000 });
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
          <h1 className='text-3xl font-bold mb-2'>Create account</h1>
          <p className='text-muted-foreground'>Sign up to get started</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <Input
              control={form.control}
              name='name'
              label='Full Name'
              placeholder='John Doe'
              disabled={isSigningUp}
            />
            <Input
              control={form.control}
              name='email'
              label='Email'
              placeholder='you@example.com'
              disabled={isSigningUp}
            />
            <Input
              control={form.control}
              name='password'
              label='Password'
              type='password'
              placeholder='••••••••'
              disabled={isSigningUp}
            />
            <Input
              control={form.control}
              name='confirmPassword'
              label='Confirm Password'
              type='password'
              placeholder='••••••••'
              disabled={isSigningUp}
            />
            <Button className='w-full h-11 mt-6' disabled={isSigningUp} type='submit'>
              {isSigningUp ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
        </Form>
        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-4 bg-card text-muted-foreground'>or continue with</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <OauthButtons />
        </div>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className='text-primary hover:underline'>
            Sign in
          </button>
        </p>
      </div>
    </PageWrapper>
  );
};

export default SignUp;
