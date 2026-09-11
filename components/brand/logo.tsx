import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type LogoMarkProps = ComponentPropsWithoutRef<'svg'> & {
  title?: string;
};

export const LogoMark = ({ className, title, ...props }: LogoMarkProps) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    {...props}
  >
    {title && <title>{title}</title>}
    <path
      d="M8 27V5h8.25C23 5 27 9.4 27 16s-4 11-10.75 11H8Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 15.5h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

type LogoProps = ComponentPropsWithoutRef<'span'> & {
  markOnly?: boolean;
};

export const Logo = ({ className, markOnly = false, ...props }: LogoProps) => (
  <span className={cn('inline-flex items-center gap-2 text-foreground', className)} {...props}>
    <LogoMark className="size-7" />
    {!markOnly && (
      <span className="whitespace-nowrap text-[0.72rem] font-medium uppercase leading-none tracking-[0.16em] sm:text-xs">
        For the <span className="font-bold">Dreamers</span>
      </span>
    )}
  </span>
);
