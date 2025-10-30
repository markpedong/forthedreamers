import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import OauthButtons from './oauth-buttons';
import useFormSchema from '@/hooks/useFormSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/reusable/input';
import { useTransition } from 'react';
import Form from '@/components/reusable/form';
import { toast } from 'sonner';
import { signUp } from '@/lib/server-actions';
import Divider from '@/components/reusable/divider';
import { useRouter } from 'next/navigation';

const SignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
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
        toast.success('Account created successfully!', { duration: 3000 });
        router.refresh();
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

        <Form
          form={form}
          onSubmit={onSubmit}
          submitLabel={isSigningUp ? 'Signing up...' : 'Sign up'}
        >
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
        </Form>
        <Divider title='or continue with' />

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
