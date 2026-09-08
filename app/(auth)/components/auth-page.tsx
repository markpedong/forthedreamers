import type { PropsWithChildren } from 'react';

const AuthPage = ({ children }: PropsWithChildren) => (
  <main className="flex min-h-[100dvh] items-center justify-center bg-muted/30 px-4 py-6 text-foreground sm:px-6 sm:py-10">
    <div className="w-full max-w-md">{children}</div>
  </main>
);

export default AuthPage;
