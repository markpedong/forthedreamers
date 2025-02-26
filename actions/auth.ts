import { FormState } from '@/constants/types'
import { loginSchema } from '@/lib/rules'
import { signIn } from 'next-auth/react'

export const login = async (_: any, formData: FormData): Promise<FormState> => {
  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  }
  const validation = loginSchema.safeParse(rawFormData)

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      values: rawFormData
    }
  }

  const callback = await signIn('credentials', {
    email: rawFormData.email,
    password: rawFormData.password,
    redirect: false
  })

  return {
    success: callback?.ok
  }
}
