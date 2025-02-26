'use server'

import { FormState } from '@/constants/types'
import { loginSchema } from '@/lib/rules'

export const login = async (state: FormState, formData: FormData): Promise<FormState> => {
  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  }

  const result = loginSchema.safeParse(rawFormData)
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: rawFormData
    }
  }

  const res = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    body: JSON.stringify(rawFormData),
    headers: { 'Content-Type': 'application/json' }
  })

  if (!res.ok) {
    return { message: 'Authentication failed' }
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
