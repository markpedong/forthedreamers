import { TAGS } from '@/constants'
import {
  AddToCartHandler,
  SellerInfo,
  TCheckoutPayload,
  TProductItem,
  TSellerItem
} from '@/constants/types'
import { Users } from '@prisma/client'
import { deleteF, get, post, upload } from './http'

export const registerUser = async (data: any) => post<Users>({ url: '/api/users', data })

export const getUserData = async (id: string) => get<Users>({ url: `/api/users/${id}`, tags: TAGS.USER })

export const refreshToken = async () => post<{ accessToken: string }>({ url: '/api/auth/refresh' })

export const uploadProfile = async (file: File) => upload<{ secure_url: string }>('/api/uploadProfile', file)

export const updateProfile = async (data?: Users | SellerInfo) =>
  post<Users>({ url: `/api/users/${data?.id}`, data: data })

export const createNewAddress = async (data: any) => post<any>({ url: '/api/address', data })

export const setDefaultAddress = async (data: any) => post<any>({ url: '/api/address/set-default', data })

export const deleteAddress = async (id: string) => deleteF({ url: `/api/address/${id}` })

export const updateAddress = async (data: any) => post<any>({ url: `/api/address/${data.id}`, data })

export const createPaymentMethod = async (data: any) => post<any>({ url: '/api/payment-methods', data })

export const updatePaymentMethod = async (data: any) => post<any>({ url: `/api/payment-methods/${data.id}`, data })

export const setDefaultPaymentMethod = async (id: string) =>
  post<any>({ url: `/api/payment-methods/set-default`, data: { id } })

export const deletePaymentMethod = async (id: string) => deleteF({ url: `/api/payment-methods/${id}` })

export const getProducts = async () => get<TProductItem[]>({ url: `/api/products` })

export const registerSeller = async (data: any) => post<Users>({ url: '/api/sellers', data })

export const getSellerProducts = async (id: string) => get<TProductItem[]>({ url: `/api/sellers/products/${id}` })

export const updateProduct = async (data: any, id: string) => post({ url: `/api/products/${id}`, data, isJSON: false })

export const createProduct = async (data: any) => post<any>({ url: '/api/products', data, isJSON: false })

export const addToCart = async (data: any) => post<any>({ url: '/api/cart', data })

export const removeFromCart = async (id?: string) => post<any>({ url: '/api/cart/remove', data: { id } })

export const deleteProduct = async (id: string) => deleteF({ url: `/api/products/${id}` })

export const getProduct = async (id: string) => get<TProductItem & { seller: TSellerItem }>({ url: `/api/products/${id}` })

export const getSellerInfo = async (id: string) => get<SellerInfo>({ url: `/api/sellers/${id}` })

export const addItemToCart = async (data: AddToCartHandler) => post({ url: '/api/cart', data })

export const deleteItemsFromCart = async (id: string) => deleteF({ url: '/api/cart', data: { id } })

export const checkoutCart = async (data: TCheckoutPayload) => post({ url: '/api/cart/checkout', data })

export const deleteOrderID = async (id?: string) => deleteF({ url: `/api/cart/checkout` })
