import Image from 'next/image';
import type { PropsWithChildren } from 'react';

const AuthPage = ({ children }: PropsWithChildren) => (
  <main className="flex min-h-screen flex-col bg-background lg:flex-row">
    {/* Mobile: floral banner at top — full width, rounded corners */}
    <div className="relative h-48 m-3 overflow-hidden rounded-3xl lg:hidden">
      <Image src="/images/sign-in.webp" alt="" fill priority className="object-cover" />
    </div>

    {/* Left: form panel */}
    <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-[55%] lg:py-16 xl:px-24 xl:py-20">
      <div className="w-full max-w-md lg:mx-auto">{children}</div>
    </div>

    {/* Right: image panel — hidden on mobile, shown on desktop */}
    <div className="hidden lg:relative lg:block m-6 lg:w-[45%]">
      <Image src="/images/sign-in.webp" alt="" fill sizes="45vw" priority className="object-cover rounded-3xl" />
    </div>

    {/* Spacer to push content above bottom nav on mobile */}
    <div className="h-16 md:hidden" />
  </main>
);

export default AuthPage;
