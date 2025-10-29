import { forwardRef, ComponentPropsWithRef } from 'react';
import { Label } from '../ui/label';
import { Input as InputUI } from '../ui/input';

type InputProps = ComponentPropsWithRef<'input'> & {
  label: string;
  id: string;
  type?: string;
  formState?: string | undefined;
  disabled?: boolean;
  prefixIconSrc?: string; // source for the icon image
};

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, id, type = 'text', formState, disabled = false, prefixIconSrc, ...rest } = props;

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <div className='relative'>
        {prefixIconSrc && (
          <img
            src={prefixIconSrc}
            alt={`${id}-icon`}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none'
          />
        )}
        <InputUI
          ref={ref}
          id={id}
          type={type}
          disabled={disabled}
          className={prefixIconSrc ? 'pl-10' : ''}
          {...rest}
        />
      </div>
      {!!formState && <p className='text-sm text-red-500'>{formState}</p>}
    </div>
  );
});

export default Input;
