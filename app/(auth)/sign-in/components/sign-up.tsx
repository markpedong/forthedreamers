import { SchemaForm, TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import OauthButtons from './oauth-buttons';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '@/components/reusable/form-field';
import { useSignUpMutation } from '@/services/useMutation';

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

  const { register, handleSubmit } = form;
  const { errors } = form.formState;

  const onSubmit = (values: SchemaForm<typeof registrationSchema>) =>
    mutation.mutate({ email: values.email, password: values.password, name: values.name });

  return (
    <AuthPage>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Join For The Dreamers and start discovering curated finds.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 sm:space-y-5">
        <FormField
          {...register('name')}
          id="signup-name"
          label="Full Name"
          error={errors.name?.message}
          placeholder="John Doe"
          disabled={isSigningUp}
        />

        <FormField
          {...register('email')}
          id="signup-email"
          label="Email"
          error={errors.email?.message}
          placeholder="you@example.com"
          disabled={isSigningUp}
        />

        <FormField
          {...register('password')}
          id="signup-password"
          label="Password"
          error={errors.password?.message}
          type="password"
          placeholder="••••••••"
          disabled={isSigningUp}
        />

        <FormField
          {...register('confirmPassword')}
          id="signup-confirm-password"
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          type="password"
          placeholder="••••••••"
          disabled={isSigningUp}
        />

        <button type="submit" className="w-full h-11" disabled={isSigningUp} aria-busy={isSigningUp}>
          {isSigningUp ? 'Signing up...' : 'Sign up'}
        </button>
      </form>

      <div className="mt-4 flex justify-center">
        <span className="text-sm text-muted-foreground">Or sign in with</span>
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
