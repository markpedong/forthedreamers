'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import formSchemas from '@/hooks/form-schemas';
import type { SchemaForm } from '@/lib/types';
import { useSignInMutation } from '@/services/useMutation';
import { z } from 'zod';

const signInSchema = z.object({ email: formSchemas.emailSchema, password: formSchemas.password });

export const useSignInForm = (portal: 'customer' | 'dashboard') => {
  const mutation = useSignInMutation(portal);
  const form = useForm<SchemaForm<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = ({ email, password }: SchemaForm<typeof signInSchema>) => {
    mutation.mutate({ email, password });
  };

  return { ...form, isSubmitting: mutation.isPending, submit };
};
