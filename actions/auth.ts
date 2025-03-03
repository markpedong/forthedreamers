'use server'

import { FormState } from '@/constants/types'
import { addressSchema, infoSchema, loginSchema } from '@/lib/rules'

export const login = async (_: any, formData: FormData): Promise<FormState<any>> => {
  const object = {
    email: formData.get('email') as string,
    username: formData.get('username') as string | undefined,
    firstName: formData.get('firstName') as string | undefined,
    lastName: formData.get('lastName') as string | undefined,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const result = loginSchema.safeParse(object)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: object }
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
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    number: formData.get('number'),
    landmark: formData.get('landmark'),
    street: formData.get('street'),
    state: formData.get('state'),
    city: formData.get('city'),
    zipCode: formData.get('zipCode'),
    country: formData.get('country'),
  }

  const result = addressSchema.safeParse(object)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, values: object }
  }

  return { success: true, errors: {}, values: object }
}
