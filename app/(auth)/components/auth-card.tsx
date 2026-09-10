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
      'w-full rounded-2xl border border-white bg-white p-4 text-foreground shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] sm:rounded-[1.75rem] sm:p-7 dark:border-white/15 dark:bg-neutral-950',
      className
    )}
  >
    <header className="mb-5 space-y-2 text-center sm:mb-6">
      {icon && (
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 sm:mb-4 sm:size-11 dark:border-white/10 dark:bg-white/10">
          {icon}
        </div>
      )}
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </header>

    <div className="[&_input]:h-10 [&_input]:rounded-lg [&_input]:border-neutral-200 [&_input]:bg-neutral-50 [&_input]:shadow-none [&_form>button]:h-10 [&_form>button]:rounded-lg dark:[&_input]:border-white/15 dark:[&_input]:bg-white/10">
      {children}
    </div>
  </section>
);

export default AuthCard;
