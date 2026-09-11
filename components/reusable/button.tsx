import { LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';

type ButtonProps = Omit<React.ComponentProps<typeof ShadcnButton>, 'asChild' | 'children' | 'title'> & {
  icon?: ReactNode;
  loading?: boolean;
  title: string;
};

export function Button({ icon, loading = false, title, disabled, ...props }: ButtonProps) {
  return (
    <ShadcnButton {...props} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : icon}
      {title}
    </ShadcnButton>
  );
}
