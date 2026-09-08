'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  label: ReactNode;
  error?: string;
  children?: ReactNode;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, name, children, 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    const inputId = id ?? name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const input = (
      <Input
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={[ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
    );

    return (
      <div className="grid gap-2">
        <Label htmlFor={inputId} data-error={!!error} className="data-[error=true]:text-destructive">
          {label}
        </Label>
        {children ? (
          <div className="relative">
            {input}
            {children}
          </div>
        ) : (
          input
        )}
        {error && (
          <p id={errorId} className="text-destructive text-sm">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
