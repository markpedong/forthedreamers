import { Users } from '@prisma/client';

export type TSessionUser = Pick<Users, 'id' | 'email' | 'username' | 'password' | 'firstName' | 'lastName'>

export type TDecodedToken = Pick<Users, 'id' | 'email' | 'firstName' | 'lastName'>;

export type ApiResponseType<T> = {
  data: T
  error?: any
  status?: number
  success: boolean
  message?: string
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type FormState = {
  errors?: Record<string, string[]>
  values?: {
    email: string
    username?: string
    firstName?: string
    lastName?: string
    password: string
    confirmPassword: string
  }
  success?: boolean
  message?: string
}

export enum LOGINFORM_STATE {
  REGISTER = 'register',
  LOGIN = 'login',
  FORGOT_PASSWORD = 'forgot-password'
}
