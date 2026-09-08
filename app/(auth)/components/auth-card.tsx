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
      'w-full rounded-2xl border border-border/80 bg-card p-5 text-card-foreground shadow-[0_24px_70px_-36px_rgba(0,0,0,0.35)] sm:p-8',
      className
    )}
  >
    <header className="mb-8 text-center">
      {icon && (
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl border bg-muted text-foreground">
          {icon}
        </div>
      )}
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
    </header>

    <div className="[&_input]:h-12 [&_input]:rounded-xl [&_input]:px-4 [&_form>button]:h-12 [&_form>button]:rounded-xl">
      {children}
    </div>
  </section>
);

export default AuthCard;
