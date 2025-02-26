import { Users } from '@prisma/client'

export type TSessionUser = Pick<Users, 'id' | 'email' | 'username' | 'password' | 'name'>

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
    password: string
    confirmPassword: string
  }
  success?: boolean
  message?: string
}