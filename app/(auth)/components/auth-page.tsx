import Image from 'next/image';
import type { PropsWithChildren } from 'react';

const AuthPage = ({ children }: PropsWithChildren) => (
  <main className="mx-auto flex min-h-screen max-w-7xl flex-col bg-background lg:flex-row">
    {/* Mobile: floral banner at top — full width, rounded corners */}
    <div className="relative h-48 m-3 overflow-hidden rounded-3xl lg:hidden">
      <Image src="/images/sign-in.webp" alt="" fill priority className="object-cover" />
    </div>

    {/* Left: form panel */}
    <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 lg:w-[55%] lg:py-16 lg:pr-16">
      <div className="w-full max-w-md">{children}</div>
    </div>

    {/* Right: image panel — hidden on mobile, shown on desktop */}
    <div className="hidden lg:relative lg:block lg:w-[45%] lg:pr-6 lg:py-6">
      <Image src="/images/sign-in.webp" alt="" fill sizes="45vw" priority className="object-cover rounded-3xl" />
    </div>

    {/* Spacer to push content above bottom nav on mobile */}
    <div className="h-16 md:hidden" />
  </main>
);

export default AuthPage;
