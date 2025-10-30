import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DefaultValues, FieldValues, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';

interface IUseValidate<TForm extends FieldValues> {
  defaultValues: DefaultValues<TForm>;
  schema?: ZodType<TForm>;
}

const useValidate = <TForm extends FieldValues>({ schema, defaultValues }: IUseValidate<TForm>) => {
  const form = useForm<TForm>({
    defaultValues,
    // @ts-expect-error
    resolver: schema ? (zodResolver(schema) as Resolver<TForm>) : undefined,
  });



  return {
    form,
  };
};

export default useValidate;
