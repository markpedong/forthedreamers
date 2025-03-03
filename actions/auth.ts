'use server'

import { FormState } from '@/constants/types'
import { addressSchema, infoSchema, loginSchema } from '@/lib/rules'
import { registerUser } from '@/utils/request'

export const login = async (_: any, formData: FormData): Promise<FormState<any>> => {
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
    birthday: formData.get('birthday') as string
  }

  const result = infoSchema.safeParse(object)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: object }
  }

  return { success: true, errors: {}, values: object }
}

export const addressInformation = async (_: any, formData: FormData): Promise<FormState<any>> => {
  const object = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    number: formData.get('number') as string,
    landmark: formData.get('landmark') as string,
    street: formData.get('street') as string,
    state: formData.get('state') as string,
    city: formData.get('city') as string,
    zipCode: formData.get('zipCode') as string,
    country: formData.get('country') as string
  }

  const result = addressSchema.safeParse(object)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: object }
  }

  return { success: true, errors: {}, values: object }
}
