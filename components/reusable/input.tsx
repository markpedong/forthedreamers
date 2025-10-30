'use client';

import { useState, ComponentPropsWithoutRef } from 'react';
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
  label: string;
  type?: string;
  disabled?: boolean;
  prefixIconSrc?: string;
  description?: string;
  control?: Control<T>;
  name: Path<T>;
  /** show/hide password toggle (only relevant for password inputs) */
  eyeIcon?: boolean;
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
  ...rest
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordProp = type === 'password';
  const computedType = eyeIcon && isPasswordProp ? (showPassword ? 'text' : 'password') : type;

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
                className={`${prefixIconSrc ? 'pl-10' : ''} ${
                  eyeIcon && isPasswordProp ? 'pr-10' : ''
                }`}
              />

              {eyeIcon && isPasswordProp && (
                <button
                  type='button' // critical: avoid submitting any parent form
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  // prevent the button from stealing focus (keeps cursor in input)
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
