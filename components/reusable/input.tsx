import { ComponentPropsWithRef } from 'react';
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

type InputProps<T extends FieldValues> = ComponentPropsWithRef<'input'> & {
  label: string;
  type?: string;
  formState?: string | undefined;
  disabled?: boolean;
  prefixIconSrc?: string;
  description?: string;
  control: Control<T>;
  name: Path<T>;
};

const Input = <T extends FieldValues>({
  type = 'text',
  formState,
  disabled,
  prefixIconSrc,
  description,
  control,
  name,
  label,
  ...rest
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <div className='relative'>
              {prefixIconSrc && (
                <img
                  src={prefixIconSrc}
                  alt={`${name}-icon`}
                  className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none h-4 w-4'
                />
              )}
              <InputUI
                type={type}
                disabled={disabled}
                {...field}
                {...rest}
                className={prefixIconSrc ? 'pl-10' : ''}
              />
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
