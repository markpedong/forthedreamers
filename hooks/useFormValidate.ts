import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DefaultValues, FieldErrors, FieldPath, FieldValues, Path, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';
import { toast } from 'sonner';

interface IUseValidate<TForm extends FieldValues> {
  defaultValues: DefaultValues<TForm>;
  schema?: ZodType<TForm>;
}

const useValidate = <TForm extends FieldValues>({ schema, defaultValues }: IUseValidate<TForm>) => {
  const {
    getValues,
    setValue,
    resetField,
    setError,
    clearErrors,
    reset,
    handleSubmit,
    register,
    watch,

    formState: { errors: errorsList, isValid, isSubmitting, isSubmitted, dirtyFields },
  } = useForm<TForm>({
    defaultValues,
    resolver: schema ? (zodResolver(schema as any) as Resolver<TForm>) : undefined,
  });

  const onChangeValue = useCallback(
    (field: FieldPath<TForm>) => (value: TForm[keyof TForm]) => {
      setValue(field, value, { shouldValidate: true });
    },
    [setValue],
  );

  const errors = useCallback(
    (field: Path<TForm>) => {
      return errorsList?.[field]?.message?.toString();
    },
    [errorsList],
  );

  const handleSetError = (field: FieldPath<TForm>, message: string) => {
    setError(field, { message } as unknown as Parameters<typeof setError>[1]);
  };

  const handleErrors = (err: FieldErrors<TForm>) => {
    const nonEmptyError = Object.values(err).find(error =>
      error?.type !== 'too_small' && !(error?.message as string)?.includes('not instance of File')
    );
    if (nonEmptyError?.message) {
      toast.error(`${nonEmptyError.message}`, { id: `form-error-${nonEmptyError.type}` });
    }
  };

  return {
    isValid,
    values: getValues,
    errors,
    setValue,
    onChangeValue,
    handleSubmit,
    handleErrors,
    loading: isSubmitting,
    isSubmitted,
    setError: handleSetError,
    clearErrors,
    watch,
    reset,
    resetField,
    register,
    dirtyFields,
  };
};

export default useValidate;
