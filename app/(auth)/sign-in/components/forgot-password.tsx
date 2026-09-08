import Input from '@/components/reusable/input';
import { SchemaForm, TOnNavigate } from '@/lib/types';
import AuthPage from '../../components/auth-page';
import formSchemas from '@/hooks/form-schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPasswordMutation } from '@/services/useMutation';
import Form from '@/components/reusable/form';
import AuthCard from '../../components/auth-card';
import { ArrowLeft, Mail } from 'lucide-react';

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
    <AuthPage>
      <AuthCard
        title="Reset your password"
        description="Enter your email and we'll send you a secure reset link."
        icon={<Mail className="size-5" />}
      >
        <Form
          form={form}
          onSubmit={onSubmit}
          isSending={isSending}
          submitLabel={isSending ? 'Sending...' : 'Send reset link'}
          className="space-y-3 sm:space-y-5"
        >
          <Input
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            disabled={isSending}
          />
        </Form>

        <div className="mt-3 text-center sm:mt-6">
          <button
            onClick={() => onNavigate('login')}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to sign in
          </button>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default ForgotPasswordPage;
