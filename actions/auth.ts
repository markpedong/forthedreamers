import { FormState } from '@/constants/types'
import { loginSchema } from '@/lib/rules'
import { registerUser } from '@/utils/request'
import { signIn } from 'next-auth/react'

export const login = async (_: any, formData: FormData): Promise<FormState> => {
  const object = {
    email: formData.get('email') as string,
    username: formData.get('username') as string | undefined,
    firstName: formData.get('firstName') as string | undefined,
    lastName: formData.get('lastName') as string | undefined,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    register: formData.get('register')
  }

  const result = loginSchema.safeParse(object)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: object }
  }

  if (!!object.register) {
    const res = await registerUser(object)
    if (res.error) {
      return { errors: { email: [res.error] }, values: object }
    }
  }

  const callback = await signIn('credentials', {
    email: object.email,
    password: object.password,
    redirect: false
  })

  if (!callback?.ok) {
    return { errors: { email: ['Invalid credentials'] }, values: object }
  }

  return { success: true, errors: {}, values: object }
}
