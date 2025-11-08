import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import OauthButtons from './oauth-buttons';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { useForm } from 'react-hook-form';
import useFormSchema from '@/hooks/useFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import Divider from '@/components/reusable/divider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { tryWithToast } from '@/utils/helper';
import { getUserDB } from '@/lib/server-actions';
import { USER_ROLE } from '@/generated/prisma';
import { useAppDispatch } from '@/redux/store';
import { setSessionData } from '@/redux/features/appSlice';
import useWithDispatch from '@/hooks/useWithDispatch';

const SignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const dispatch = useAppDispatch();
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
  const { signOut } = useWithDispatch();

  const onSubmit = async (values: SchemaForm<typeof loginSchema>) => {
    startSubmitting(async () => {
      const res = await tryWithToast(
        authClient.signIn.email({
          email: values.email,
          password: values.password,
        }),
      );
      if (!res) return;

      const user = await getUserDB(`${res.data?.user.id}`);
      if (user?.role !== USER_ROLE.USER) {
        await signOut();
        router.refresh();
        toast.error('You are not authorized to access this page, please use the seller panel.', {
          duration: 5000,
        });
        return;
      }

      if ((res?.data as any)?.twoFactorRedirect) {
        onNavigate('2fa');
        return;
      }

      toast.success('Sign in successfully!', { duration: 2000 });
      const session = await authClient.getSession();
      dispatch(setSessionData(session));
      router.refresh();
    });
  };

  const handlePasskeySignin = () => {
    authClient.signIn.passkey(undefined, {
      onSuccess: () => {
        router.push('/profile');
      },
    });
  };

  // enable this if you want to use passkey upon refresh.
  // useEffect(() => {
  //   handlePasskeySignin();
  // }, [refetch, router]);

  return (
    <PageWrapper>
      <div>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Welcome back</h1>
          <p className='text-muted-foreground'>Sign in to your account to continue</p>
        </div>

        <div className='space-y-5'>
          <Form
            form={form}
            onSubmit={onSubmit}
            submitLabel={isSubmit ? 'Signing in...' : 'Sign in'}
          >
            <Input name='email' label='Email' placeholder='you@example.com' preventSpaces />
            <Input
              name='password'
              label='Password'
              type='password'
              placeholder='••••••••'
              preventSpaces
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
          </Form>
          <Button
            className='w-full h-11'
            type='button'
            variant='secondary'
            onClick={handlePasskeySignin}
          >
            Login with Passkey
          </Button>
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
        <Divider title='Or sign in as a seller' />
        <p className='text-center text-sm text-muted-foreground mt-4'>
          Want to sell?{' '}
          <Link href='/seller' className='text-primary hover:underline font-medium'>
            Click here
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default SignIn;
