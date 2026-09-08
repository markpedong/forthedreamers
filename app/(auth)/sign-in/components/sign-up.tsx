import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import OauthButtons from './oauth-buttons';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/reusable/input';
import Form from '@/components/reusable/form';
import { toast } from 'sonner';
import { signUp } from '@/lib/http';
import { useMutation } from '@tanstack/react-query';
import Divider from '@/components/reusable/divider';
import { useRouter } from 'next/navigation';

const SignUp = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('Account created successfully!', { duration: 3000 });
      router.refresh();
    },
    onError: error => toast.error(error.message),
  });
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
    <PageWrapper>
      <div>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Create account</h1>
          <p className="text-muted-foreground">Sign up to get started</p>
        </div>

        <Form
          form={form}
          onSubmit={onSubmit}
          isSending={isSigningUp}
          submitLabel={isSigningUp ? 'Signing up...' : 'Sign up'}
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

        <div className="grid grid-cols-2 gap-3">
          <OauthButtons next="/profile" />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-primary hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </PageWrapper>
  );
};

export default SignUp;
