import Image from 'next/image';
import type { PropsWithChildren } from 'react';

const AuthPage = ({ children }: PropsWithChildren) => (
  <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
    <Image src="/images/sign-in.webp" alt="" fill sizes="100vw" priority className="object-cover object-center" />
    <div className="absolute inset-0 bg-black/45" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />

    <div className="relative z-10 w-full max-w-lg">
      {children}
    </div>
  </main>
);

export default AuthPage;
