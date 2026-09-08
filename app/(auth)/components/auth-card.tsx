import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AuthCardProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  icon?: ReactNode;
  className?: string;
};

const AuthCard = ({ title, description, children, eyebrow, icon, className }: AuthCardProps) => (
  <section
    className={cn(
      'w-full rounded-[1.75rem] border border-white bg-white p-5 text-foreground shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] sm:p-7 dark:border-white/15 dark:bg-neutral-950',
      className
    )}
  >
    <header className="mb-6 space-y-2 text-center">
      {icon && (
        <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-white/10">
          {icon}
        </div>
      )}
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </header>

    <div className="[&_input]:h-11 [&_input]:rounded-xl [&_input]:border-neutral-200 [&_input]:bg-neutral-50 [&_input]:shadow-none [&_form>button]:h-11 [&_form>button]:rounded-xl dark:[&_input]:border-white/15 dark:[&_input]:bg-white/10">
      {children}
    </div>
  </section>
);

export default AuthCard;
