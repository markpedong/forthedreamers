import { Addresses, Users } from '@prisma/client'
import { get, post, upload } from './http'

export const registerUser = async (body: any) => post<Users>({ url: '/api/users', data: body })

export const getUserData = async (id: string, token?: string) =>
  get<Users>({ url: `/api/users/${id}`, accessToken: token })

export const refreshToken = async () => post<{ accessToken: string }>({ url: '/api/auth/refresh' })

export const uploadProfile = async (file: File) => upload<{ secure_url: string }>('/api/uploadProfile', file)

export const updateProfile = async (body: Users) => post<Users>({ url: `/api/users/${body.id}`, data: body })

export const createNewAddress = async (body: any) => post<any>({ url: '/api/address', data: body })

export const getAddress = async (accessToken?: string) => get<Addresses>({ url: `/api/address`, accessToken })