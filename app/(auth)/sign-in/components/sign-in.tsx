'use client';

import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import OauthButtons from './oauth-buttons';
import Form from '@/components/reusable/form';
import Input from '@/components/reusable/input';
import { useForm } from 'react-hook-form';
import formSchemas from '@/hooks/form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Divider from '@/components/reusable/divider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { signIn } from '@/lib/http';
import { useMutation } from '@tanstack/react-query';
import { setUserData } from '@/redux/reducers/userData';
import { store } from '@/redux/store';

const SignIn = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: result => {
      (store.dispatch as any)(setUserData(result.data!));
      toast.success('Sign in successfully!', { duration: 2000 });
      router.replace('/profile');
      router.refresh();
    },
    onError: error => toast.error(error.message, { duration: 5000 }),
  });
  const isSubmit = mutation.isPending;
  const { loginSchema } = formSchemas;

  const form = useForm<SchemaForm<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SchemaForm<typeof loginSchema>) => {
    mutation.mutate({ email: values.email, password: values.password, audience: 'user' });
  };

  return (
    <PageWrapper>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>

          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="space-y-5">
          <Form
            form={form}
            onSubmit={onSubmit}
            isSending={isSubmit}
            submitLabel={isSubmit ? 'Signing in...' : 'Sign in'}
          >
            <Input name="email" label="Email" placeholder="you@example.com" preventSpaces disabled={isSubmit} />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              preventSpaces
              disabled={isSubmit}
            />

            <div className="flex items-center justify-end">
              <span
                onClick={e => {
                  e.preventDefault();

                  if (!isSubmit) {
                    onNavigate('forgot');
                  }
                }}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                Forgot password?
              </span>
            </div>
          </Form>
        </div>

        <Divider title="or continue with" />

        <div>
          <OauthButtons next="/profile" />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <button onClick={() => onNavigate('register')} className="text-primary hover:underline" type="button">
            Create account
          </button>
        </p>

        <Divider title="Or sign in as a seller" />

        <p className="text-center text-sm text-muted-foreground mt-4">
          Want to sell?{' '}
          <Link href="/seller" className="text-primary hover:underline font-medium">
            Click here
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default SignIn;
