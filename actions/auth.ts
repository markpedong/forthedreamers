'use server'

import { RegisterFormSchema } from '@/lib/rules'

export type FormState = {
  errors?: Record<string, string[]>
  values?: {
    email: string
    password: string
    confirmPassword: string
  }
  success?: boolean
  message?: string
}

export const register = async (state: FormState, formData: FormData): Promise<FormState> => {
  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  }

  const result = RegisterFormSchema.safeParse(rawFormData)
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: rawFormData
    }
  }

  return {
    success: true,
    message: 'Form submitted successfully!',
    values: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }
}
