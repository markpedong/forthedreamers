'use client';

import { useState } from 'react';
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
import type { FieldValues } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { ReusableInputProps } from '@/lib/types';

const Input = <T extends FieldValues>(props: ReusableInputProps<T>) => {
  const {
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
  } = props as any; // TypeScript union workaround

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isNumber = type === 'number';
  const computedType =
    eyeIcon && isPassword ? (showPassword ? 'text' : 'password') : isNumber ? 'text' : type;
  const isTextArea = type === 'textarea';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel htmlFor={String(name)}>{label}</FormLabel>}
          <FormControl>
            <div className='relative'>
              {prefixIconSrc && (
                <img
                  src={prefixIconSrc}
                  alt={`${String(name)}-icon`}
                  className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4'
                />
              )}

              {isTextArea ? (
                <Textarea
                  {...field}
                  {...rest}
                  disabled={disabled}
                  id={String(name)}
                  className='mt-1.5 min-h-24'
                  onChange={(e) => {
                    let value = e.target.value;
                    if (preventSpaces) value = value.replace(/\s+/g, '');
                    field.onChange(value);
                  }}
                  onKeyDown={(e) => {
                    if (preventSpaces && e.key === ' ') e.preventDefault();
                  }}
                  value={field.value ?? ''}
                />
              ) : (
                <InputUI
                  {...field}
                  {...rest}
                  type={computedType}
                  inputMode={isNumber ? 'numeric' : undefined}
                  disabled={disabled}
                  id={String(name)}
                  className={`${prefixIconSrc ? 'pl-10' : ''} ${
                    eyeIcon && isPassword ? 'pr-10' : ''
                  }`}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (preventSpaces) value = value.replace(/\s+/g, '');
                    if (isNumber) value = value.replace(/\D+/g, '');
                    field.onChange(value);
                  }}
                  onKeyDown={(e) => {
                    if (preventSpaces && e.key === ' ') e.preventDefault();
                    if (isNumber && ['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  value={field.value ?? ''}
                />
              )}

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
