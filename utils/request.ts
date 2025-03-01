import { Users } from '@prisma/client'
import { get, post } from './http'

export const registerUser = async (body: any) => post<Users>({ url: '/api/users', data: body })

export const getUserData = async (id: string) => get<Users>({ url: `/api/users/${id}` })
