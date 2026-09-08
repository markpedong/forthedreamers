'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { getCurrentUser, resendVerification } from '@/lib/http';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';

const VerifyEmailPage = () => {
  const router = useRouter();
  const userQuery = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    select: result => result.data,
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => toast.success('Verification link sent! Check your inbox.', { duration: 3000 }),
    onError: error => toast.error(error.message, { duration: 3000 }),
  });
  const email = userQuery.data?.email;

  useEffect(() => {
    if (userQuery.isError) router.push('/sign-in');
  }, [router, userQuery.isError]);

  const handleResend = () => mutation.mutate();

  if (userQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We sent a verification link to {email && <span className="font-medium text-foreground">{email}</span>}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-secondary/50 rounded-lg p-4 border border-border space-y-3">
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
            className="w-full flex items-center justify-center gap-2"
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

          <div className="pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => router.push('/sign-in')} className="w-full">
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
