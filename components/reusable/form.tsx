import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Form as FormUI } from '../ui/form';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import classnames from 'classnames';

type FormProps<T extends FieldValues> = Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> & {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  isSending?: boolean;
  children: ReactNode;
  submitLabel?: string;
  customSubmitButton?: boolean;
};

const Form = <T extends FieldValues>({
  children,
  form,
  onSubmit,
  submitLabel,
  className,
  customSubmitButton = false,
  ...rest
}: FormProps<T>) => {
  return (
    <FormUI {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        {...rest}
        className={classnames('space-y-6', className)}
      >
        {children}
        {!customSubmitButton && (
          <Button className='w-full h-11' disabled={submitLabel?.includes('.')}>
            {submitLabel}
          </Button>
        )}
      </form>
    </FormUI>
  );
};

export default Form;
