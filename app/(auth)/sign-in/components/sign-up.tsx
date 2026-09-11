import { SchemaForm, TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import OauthButtons from './oauth-buttons';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/reusable/input';
import Form from '@/components/reusable/form';
import { useSignUpMutation } from '@/services/useMutation';

const SignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const mutation = useSignUpMutation();
  const isSigningUp = mutation.isPending;
  const { registrationSchema } = formSchemas;

  const form = useForm<SchemaForm<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: '',
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: SchemaForm<typeof registrationSchema>) =>
    mutation.mutate({
      email: values.email,
      password: values.password,
      username: values.username,
      displayName: values.displayName || undefined,
    });
  return (
    <AuthPage>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Join For The Dreamers and start discovering curated finds.
      </p>

      <Form
        form={form}
        onSubmit={onSubmit}
        isSending={isSigningUp}
        submitLabel="Sign up"
        className="mt-6 space-y-4 sm:space-y-5"
      >
        <Input
          control={form.control}
          name="username"
          label="Username"
          placeholder="markpedong"
          description="Lowercase letters, numbers, and underscores."
          disabled={isSigningUp}
          preventSpaces
        />

        <Input
          control={form.control}
          name="displayName"
          label="Display name (optional)"
          placeholder="Leave blank and we'll pick one for you"
          disabled={isSigningUp}
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

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">Or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <OauthButtons next="/profile" />

      <p className="mt-3 text-center text-sm text-muted-foreground sm:mt-6">
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className="font-medium text-primary hover:underline-offset-4">
          Sign in
        </button>
      </p>
    </AuthPage>
  );
};

export default SignUp;
