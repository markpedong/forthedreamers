'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import formSchemas from '@/hooks/form-schemas';
import { useSignInMutation } from '@/services/useMutation';
import { z } from 'zod';

const signInSchema = z.object({ email: formSchemas.emailSchema, password: formSchemas.password });

export const useSignInForm = (portal: 'customer' | 'dashboard') => {
  const mutation = useSignInMutation(portal);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  return { ...form, isSubmitting: mutation.isPending, mutation };
};
