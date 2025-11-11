'use client';

import { Checkbox as CheckboxUI } from '../ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import type { Control, FieldValues, Path } from 'react-hook-form';

export interface ReusableCheckboxProps<T extends FieldValues> {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
}

const Checkbox = <T extends FieldValues>(props: ReusableCheckboxProps<T>) => {
  const { control, name, label, description, disabled } = props as any;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex gap-3'>
          <FormControl>
            <CheckboxUI
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          {label && <FormLabel className='text-sm font-medium'>{label}</FormLabel>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Checkbox;
