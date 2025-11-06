'use client';

import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import type { FieldValues } from 'react-hook-form';
import { ReusableSelectProps } from '@/lib/types';

const Select = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder = 'Select...',
  options,
  disabled = false,
}: ReusableSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <SelectUI value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <SelectTrigger className='mt-1.5'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectUI>
          </FormControl>
          {description && <div className='text-sm text-muted-foreground'>{description}</div>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Select;
