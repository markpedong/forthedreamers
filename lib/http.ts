'use client'

import {toast} from 'sonner'
import {API_ROUTE} from '@/constants/enum'
import {buildQueryParams} from '@/utils/helper'
import type {CartItem} from './services/cart'
import type {ApiResponse, BaseQueryParams, ProductFormData, TCreateSeller, TProduct} from './types'

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  showErrorToast?: boolean
}

export const apiFetch = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
  const {body, showErrorToast = true, ...requestOptions} = options
  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...requestOptions.headers
    },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body)
  })
  const data = await response.json().catch(() => null) as ApiResponse<T> | null

  if (!response.ok) {
    const message = data?.message || response.statusText || 'Request failed'
    if (showErrorToast) toast.error(message)
    throw new Error(message)
  }

  if (!data) throw new Error('Invalid server response')
  return data
}

export const checkStore = (storeName: string) => apiFetch<{exists: boolean}>(API_ROUTE.STORE_CHECK, {
  method: 'POST',
  body: {storeName}
})

export const createSeller = ({storeName, userID}: TCreateSeller) => apiFetch(API_ROUTE.SELLER, {
  method: 'POST',
  body: {storeName, userID}
})

export const getProducts = (params: BaseQueryParams) => apiFetch<TProduct[]>(`${API_ROUTE.PRODUCTS}?${buildQueryParams(params)}`)

export const getCategories = (params?: BaseQueryParams) => apiFetch(`${API_ROUTE.CATEGORIES}?${buildQueryParams(params)}`)

export const addCategory = (name: string) => apiFetch(API_ROUTE.CATEGORIES, {method: 'POST', body: {name}})

export const updateCategory = ({id, name}: {id: string; name: string}) =>
  apiFetch(API_ROUTE.CATEGORIES, {method: 'PUT', body: {id, name}})

export const createProduct = (productData: ProductFormData) =>
  apiFetch<TProduct>(API_ROUTE.PRODUCTS, {method: 'POST', body: productData})

export const updateProduct = (productData: ProductFormData) =>
  apiFetch<TProduct>(API_ROUTE.PRODUCTS, {method: 'PUT', body: productData})

export const deleteProduct = (id: string) => apiFetch(API_ROUTE.PRODUCTS, {method: 'DELETE', body: {id}})

export const toggleProductStatus = ({id}: {id: string}) =>
  apiFetch(`${API_ROUTE.PRODUCTS}/toggle`, {method: 'PATCH', body: {id}})

export const getProduct = (slug: string) => apiFetch<TProduct>(`${API_ROUTE.PRODUCTS}/${slug}`)

// ─── Cart ──────────────────────────────────────────────────────────────────

type CartMutationData = {
  item: CartItem | null
  removedId: string | null
  count: number
}

export const getCartItems = () => apiFetch<CartItem[]>(API_ROUTE.CART)

export const getCartCount = () => apiFetch<{count: number}>(`${API_ROUTE.CART}?summary=count`, {
  cache: 'no-store',
  showErrorToast: false
})

export const removeCartItem = (cartItemId: string) =>
  apiFetch<CartMutationData>(`${API_ROUTE.CART}?id=${cartItemId}`, {method: 'DELETE', showErrorToast: false})

export const addCartItem = ({variantId, quantity}: {variantId: string; quantity: number}) =>
  apiFetch<CartMutationData>(API_ROUTE.CART, {method: 'POST', body: {variantId, quantity}, showErrorToast: false})

export const updateCartQuantity = ({cartItemId, quantity}: {cartItemId: string; quantity: number}) =>
  apiFetch<CartMutationData>(API_ROUTE.CART, {method: 'PUT', body: {cartItemId, quantity}, showErrorToast: false})

export const checkoutCart = () => apiFetch(`${API_ROUTE.CART}/checkout`, {method: 'POST'})

// ─── Wishlist ──────────────────────────────────────────────────────────────

export const getWishlistIds = () => apiFetch<{ids: string[]}>(
  '/api/wishlist?ids=true',
  {cache: 'no-store', showErrorToast: false}
)

export const setWishlist = (productId: string, wanted: boolean) => apiFetch<{productId: string; wanted: boolean}>(
  wanted ? '/api/wishlist' : `/api/wishlist?productId=${encodeURIComponent(productId)}`,
  {
    method: wanted ? 'POST' : 'DELETE',
    body: wanted ? {productId} : undefined,
    showErrorToast: false
  }
)
