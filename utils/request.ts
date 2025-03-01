import { Users } from '@prisma/client'
import { get, post } from './http'

export const registerUser = async (body: any) => post<Users>({ url: '/api/users', data: body })

export const getUserData = async (id: string, token?: string) => get<Users>({ url: `/api/users/${id}`, accessToken: token })

export const refreshToken = async () => post<string>({ url: '/api/auth/refresh' })