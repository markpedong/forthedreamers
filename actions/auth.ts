'use server'

import { FormState, LoginFormState } from '@/constants/types'
import { infoSchema, loginSchema } from '@/lib/rules'
import { registerUser } from '@/utils/request'
import { first } from 'lodash'

export const login = async (_: any, formData: FormData): Promise<FormState<LoginFormState>> => {
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
    try {
      const res = await registerUser(object)
      if (res.error) {
        return { errors: { email: [res.error] }, values: object }
      }
    } catch (error) {
      return { errors: { email: ['There is already a user with this email'] }, values: object }
    }
  }

  return { success: true, errors: {}, values: object }
}

export const personalInformation = async (_: any, formData: FormData): Promise<FormState<any>> => {
  const object = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    birthday: formData.get('birthday') as string,
  }

  const result = infoSchema.safeParse(object)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: object }
  }

  return { success: true, errors: {}, values: {} }
}