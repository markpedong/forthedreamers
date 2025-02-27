import { ApiResponseType } from '@/constants/types'
import { addToast } from '@heroui/react'
import { Users } from '@prisma/client'

type Params = {
  body?: Record<string, any>
  accessToken?: string
  url: string
  isJson?: boolean
  isSecured?: boolean
}

const handleResponse = async <T>(response: Response): Promise<ApiResponseType<T>> => {
  const responseData = await response.json()
  if (!response.ok) {
    if (typeof window !== 'undefined') {
      addToast({ title: responseData?.message || responseData?.error, color: 'danger' })
    }
    throw new Error(responseData?.message || 'Request failed')
  }

  return responseData
}

const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return null

    const response = await post<{ accessToken: string }>({
      url: '/api/auth/refresh',
      body: { refreshToken },
      isJson: true,
      isSecured: false
    })

    if (!response || !response.data?.accessToken) return null

    localStorage.setItem('accessToken', response.data.accessToken)
    return response.data.accessToken
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}

const apiRequest = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  accessToken: string,
  body?: unknown,
  isJson: boolean = false,
  attempt: number = 1
): Promise<ApiResponseType<T>> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'Accept-Language': typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en'
  }

  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${process.env.NEXTAUTH_URL}${url}`, {
    method,
    headers,
    body: body ? (isJson ? JSON.stringify(body) : (body as BodyInit)) : undefined
  })

  if (response.status !== 401) return handleResponse(response)
  if (attempt >= 2) throw new Error('Failed to refresh token after 2 attempts')

  const newToken = await refreshToken()
  if (!newToken) throw new Error('Failed to refresh token')

  return apiRequest(url, method, newToken, body, isJson, attempt + 1)
}

export const get = async <T>({ url, accessToken, isSecured }: Params): Promise<ApiResponseType<T>> => {
  if (isSecured && !accessToken) throw new Error('Authorization token is missing')
  return apiRequest<T>(url, 'GET', `${accessToken}`)
}

export const post = async <T>({
  url,
  accessToken,
  body,
  isJson,
  isSecured = true
}: Params): Promise<ApiResponseType<T>> => {
  if (isSecured && !accessToken) throw new Error('Authorization token is missing')
  return apiRequest<T>(url, 'POST', accessToken || '', body, isJson)
}

export const deleteFunc = async <T>({ url, accessToken, body, isJson }: Params): Promise<ApiResponseType<T>> => {
  if (!accessToken) throw new Error('Authorization token is missing')
  return apiRequest<T>(url, 'DELETE', accessToken, body, isJson)
}

export const registerUser = async (body: any) =>
  post<Users>({ url: '/api/users', body, isJson: true, isSecured: false })

export const getUserData = async (id: string) => get<Users>({ url: `/api/users/${id}`, isSecured: false })
