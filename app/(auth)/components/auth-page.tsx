import Image from 'next/image';
import type { PropsWithChildren } from 'react';

const AuthPage = ({ children }: PropsWithChildren) => (
  <main className="mx-auto flex min-h-screen max-w-7xl flex-col bg-background lg:flex-row">
    {/* Mobile: banner at top — full width, rounded corners */}
    <div className="relative h-48 m-3 overflow-hidden rounded-3xl lg:hidden">
      <Image src="/images/sign-in.webp" alt="" fill priority className="object-cover" />
    </div>

    {/* Left: form panel */}
    <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-[52%] lg:py-16">
      <div className="w-full max-w-md">{children}</div>
    </div>

    {/* Right: image card — hidden on mobile, shown on desktop */}
    <div className="hidden lg:relative lg:block lg:m-6 lg:w-[48%]">
      <Image src="/images/sign-in.webp" alt="" fill sizes="48vw" priority className="object-cover rounded-3xl" />
    </div>

    {/* Spacer to push content above bottom nav on mobile */}
    <div className="h-16 md:hidden" />
  </main>
);

export default AuthPage;
