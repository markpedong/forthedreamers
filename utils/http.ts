import { STALE_TIME } from '@/constants'
import { stringify } from 'qs'
import { addToast } from '@heroui/react'
import { ApiResponse, RequestParams, serverErr } from '@/constants/types'
import { getLocalStorage } from './xLocalStorage'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getSession, signOut } from 'next-auth/react'
import { refreshToken } from './request'

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) return serverErr as ApiResponse<T>

  const isClient = typeof window !== 'undefined'
  const data: ApiResponse<T> = await response.json()

  if (data.status !== 200) {
    isClient && addToast({ title: data.message })
    return data
  }

  return data
}

const fetchWithToken = async (url: string, options: RequestInit, attempt: number = 1) => {
  // token
  const token =
    typeof window !== 'undefined'
      ? !!getLocalStorage('accessToken') || (await getSession())?.accessToken
      : (await getServerSession(authOptions))?.accessToken

  // main fetch
  const response = await fetch(`${process.env.NEXTAUTH_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  })

  if (response.status !== 401) return response
  if (attempt >= 2) throw new Error('Unauthorized')

  const tokenRes = await refreshToken()
  if (!tokenRes) throw new Error('Failed to refresh token')
  localStorage.setItem('accessToken', tokenRes?.data)

  return fetchWithToken(url, options, attempt + 1)
}

const upload = async <T>(url: string, file: File): Promise<ApiResponse<T>> => {
  const form = new FormData()
  form.append('file', file)

  const response = await fetchWithToken(url, {
    method: 'POST',
    body: form
  })

  return handleResponse<T>(response)
}

const post = async <T>({ url, data = {} }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  return handleResponse<T>(response)
}

const get = async <T>({ url, data, tags }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken(`${url}${!!stringify(data) ? '?' + stringify(data) : ''}`, {
    method: 'GET',
    next: { tags: [tags || ''], revalidate: STALE_TIME * 6 }
  })

  return handleResponse<T>(response)
}

export { get, post, upload }
