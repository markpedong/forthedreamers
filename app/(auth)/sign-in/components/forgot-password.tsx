import Input from '@/components/reusable/input';
import { SchemaForm, TOnNavigate } from '@/lib/types';
import PageWrapper from './page-wrapper';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPasswordMutation } from '@/services/useMutation';
import Form from '@/components/reusable/form';

const ForgotPasswordPage = ({ onNavigate }: { onNavigate: TOnNavigate }) => {
  const { forgotPasswordSchema } = formSchemas;
  const mutation = useForgotPasswordMutation({ onSuccess: () => onNavigate('login'), duration: 2000 });
  const isSending = mutation.isPending;
  const form = useForm<SchemaForm<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: SchemaForm<typeof forgotPasswordSchema>) => mutation.mutate(values.email);

  return (
    <PageWrapper>
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset password</h1>
          <p className="text-muted-foreground">Enter your email to receive a reset link</p>
        </div>

        <div className="space-y-5">
          <Form
            form={form}
            onSubmit={onSubmit}
            isSending={isSending}
            submitLabel={isSending ? 'Sending...' : 'Send reset link'}
          >
            <Input
              control={form.control}
              name="email"
              label="Forgot Email"
              placeholder="you@example.com"
              description="Must contain uppercase, lowercase, and numbers"
              disabled={isSending}
            />
          </Form>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to sign in
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
