import { SchemaForm, TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import OauthButtons from './oauth-buttons';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/reusable/input';
import Form from '@/components/reusable/form';
import { useSignUpMutation } from '@/services/useMutation';
import Divider from '@/components/reusable/divider';
import AuthCard from '../../components/auth-card';

const SignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const mutation = useSignUpMutation();
  const isSigningUp = mutation.isPending;
  const { registrationSchema } = formSchemas;

  const form = useForm<SchemaForm<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SchemaForm<typeof registrationSchema>) =>
    mutation.mutate({ email: values.email, password: values.password, name: values.name });
  return (
    <AuthPage>
      <AuthCard title="Create your account" description="Join For The Dreamers and start discovering curated finds." eyebrow="New here">
        <Form
          form={form}
          onSubmit={onSubmit}
          isSending={isSigningUp}
          submitLabel={isSigningUp ? 'Signing up...' : 'Sign up'}
          className="space-y-3 sm:space-y-5"
        >
          <Input
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            disabled={isSigningUp}
            preventSpaces
          />

          <Input
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            disabled={isSigningUp}
            preventSpaces
          />

          <Input
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            disabled={isSigningUp}
            preventSpaces
          />

          <Input
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            disabled={isSigningUp}
            preventSpaces
          />
        </Form>

        <Divider title="or continue with" />

        <OauthButtons next="/profile" />

        <p className="mt-3 text-center text-sm text-muted-foreground sm:mt-6">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </button>
        </p>
      </AuthCard>
    </AuthPage>
  );
};

export default SignUp;
