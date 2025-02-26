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
