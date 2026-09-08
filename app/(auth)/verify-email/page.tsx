'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useResendVerificationMutation } from '@/services/useMutation';
import { useCurrentUserQuery } from '@/services/useQuery';
import AuthPage from '../components/auth-page';
import AuthCard from '../components/auth-card';

const VerifyEmailPage = () => {
  const router = useRouter();
  const userQuery = useCurrentUserQuery();
  const mutation = useResendVerificationMutation({
    message: 'Verification link sent! Check your inbox.',
    duration: 3000,
  });
  const email = userQuery.data?.email;

  useEffect(() => {
    if (userQuery.isError) router.push('/sign-in');
  }, [router, userQuery.isError]);

  const handleResend = () => mutation.mutate();

  if (userQuery.isPending) {
    return (
      <AuthPage>
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/45 bg-white/70 shadow-xl backdrop-blur-2xl dark:border-white/15 dark:bg-neutral-950/70">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </AuthPage>
    );
  }

  return (
    <AuthPage>
      <AuthCard
        title="Verify your email"
        description={
          <>
            We sent a verification link to {email && <span className="font-medium text-foreground">{email}</span>}
          </>
        }
        icon={<Mail className="size-5" />}
      >
        <div className="space-y-6">
          <div className="space-y-3 rounded-xl border border-white/50 bg-white/35 p-4 dark:border-white/10 dark:bg-white/5">
            <h3 className="font-medium text-sm">What to do next:</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Check your email inbox for a message from us</li>
              <li>Click the verification link in the email</li>
              <li>If you don&apos;t see it, check your spam or junk folder</li>
            </ol>
          </div>

          <Button
            onClick={handleResend}
            disabled={mutation.isPending || !email}
            className="h-12 w-full rounded-xl"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Resend Verification Link
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try resending.
          </p>

          <div className="border-t border-foreground/10 pt-4">
            <Button variant="ghost" onClick={() => router.push('/sign-in')} className="h-11 w-full rounded-xl">
              Back to Sign In
            </Button>
          </div>
        </div>
      </AuthCard>
    </AuthPage>
  );
};

export default VerifyEmailPage;
