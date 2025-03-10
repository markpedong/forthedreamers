import { Addresses, Users } from '@prisma/client'
import { deleteF, get, post, upload } from './http'

export const registerUser = async (body: any) => post<Users>({ url: '/api/users', data: body })

export const getUserData = async (id: string) => get<Users>({ url: `/api/users/${id}` })

export const refreshToken = async () => post<{ accessToken: string }>({ url: '/api/auth/refresh' })

export const uploadProfile = async (file: File) => upload<{ secure_url: string }>('/api/uploadProfile', file)

export const updateProfile = async (body?: Users) => post<Users>({ url: `/api/users/${body?.id}`, data: body })

export const createNewAddress = async (body: any) => post<any>({ url: '/api/address', data: body })

export const getAddress = async () => get<Addresses>({ url: `/api/address` })

export const setDefaultAddress = async (body: any) => post<any>({ url: '/api/address/set-default', data: body })

export const deleteAddress = async (id: string) => deleteF({ url: `/api/address/${id}` })

export const updateAddress = async (body: any) => post<any>({ url: `/api/address/${body.id}`, data: body })

export const createPaymentMethod = async (body: any) => post<any>({ url: '/api/payment-methods', data: body })

export const updatePaymentMethod = async (body: any) =>
  post<any>({ url: `/api/payment-methods/${body.id}`, data: body })

export const setDefaultPaymentMethod = async (id: string) =>
  post<any>({ url: `/api/payment-methods/set-default`, data: { id } })

export const deletePaymentMethod = async (id: string) => deleteF({ url: `/api/payment-methods/${id}` })

export const getProducts = async () => get<any>({ url: `/api/products` })

export const registerSeller = async (body: any) => post<Users>({ url: '/api/sellers', data: body })

export const updateProduct = async (body: any, id: string) =>
  post({ url: `/api/products/${id}`, data: body, isJSON: false })

export const createProduct = async (body: any) => post<any>({ url: '/api/products', data: body, isJSON: false })

export const addToCart = async (body: any) => post<any>({ url: '/api/cart', data: body })

export const removeFromCart = async (id?: string) => post<any>({ url: '/api/cart/remove', data: { id } })

export const deleteProduct = async (id: string) => deleteF({ url: `/api/products/${id}` })