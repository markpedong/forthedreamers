'use client';

import { useState, ComponentPropsWithoutRef, KeyboardEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input as InputUI } from '../ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import type { Control, Path, FieldValues } from 'react-hook-form';

type InputProps<T extends FieldValues> = ComponentPropsWithoutRef<'input'> & {
  label?: string;
  type?: string;
  disabled?: boolean;
  prefixIconSrc?: string;
  description?: string;
  control?: Control<T>;
  name: Path<T>;
  eyeIcon?: boolean;
  preventSpaces?: boolean;
};

const Input = <T extends FieldValues>({
  type = 'text',
  disabled,
  prefixIconSrc,
  description,
  control,
  name,
  label,
  eyeIcon = true,
  preventSpaces = false,
  ...rest
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isNumber = type === 'number';
  const computedType = eyeIcon && isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const isShortcut = e.ctrlKey || e.metaKey;
    if (isShortcut) return; // always allow copy/paste/select all/cut

    if (preventSpaces && e.key === ' ') {
      e.preventDefault();
    }

    if (
      isNumber &&
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'].includes(e.key)
    ) {
      e.preventDefault();
    }

    rest.onKeyDown?.(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text');

    if (preventSpaces && paste.includes(' ')) {
      e.preventDefault();
    }

    if (isNumber && !/^\d*$/.test(paste)) {
      e.preventDefault();
    }

    rest.onPaste?.(e);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={String(name)}>{label}</FormLabel>
          <FormControl>
            <div className='relative'>
              {prefixIconSrc && (
                <img
                  src={prefixIconSrc}
                  alt={`${String(name)}-icon`}
                  className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4'
                />
              )}

              <InputUI
                {...field}
                {...rest}
                type={computedType}
                disabled={disabled}
                id={String(name)}
                className={`${prefixIconSrc ? 'pl-10' : ''} ${eyeIcon && isPassword ? 'pr-10' : ''}`}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />

              {eyeIcon && isPassword && (
                <button
                  type='button'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  onMouseDown={(e) => e.preventDefault()}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {!showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              )}
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Input;
