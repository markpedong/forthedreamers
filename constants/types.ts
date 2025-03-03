import { Users } from '@prisma/client'
import { GetProp, UploadProps } from 'antd'

export type TSessionUser = Pick<Users, 'id' | 'email' | 'username' | 'password' | 'firstName' | 'lastName'>

export type TCustomToken = TSessionUser & { accessToken: string }

export type TDecodedToken = Pick<Users, 'id' | 'email' | 'firstName' | 'lastName'>

export type ApiResponse<T> = {
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

export type FormState<T> = {
  errors?: Record<string, string[]>
  values?: T
  success?: boolean
  message?: string
}

export enum LOGINFORM_STATE {
  REGISTER = 'register',
  LOGIN = 'login',
  FORGOT_PASSWORD = 'forgot-password'
}

export type UserItem = {
  id: string
  email: string | null
  username: string
  firstName: string | null
  lastName: string | null
  image: string | null
  password: string
  refreshToken: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export const serverErr = {
  message: 'server error',
  data: {},
  status: 500,
  success: false
} satisfies ApiResponse<any>

export type RequestParams = {
  url: string
  data?: any
  tags?: string
  accessToken?: string
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export type TAddTailwindUtility = {
  addUtilities: (utilities: any) => void
  addComponents: (components: any) => void
}
