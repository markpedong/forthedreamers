import { STALE_TIME } from '@/constants'
import throttle from 'lodash/throttle'
import { stringify } from 'qs'
import { addToast } from '@heroui/react'
// import { unauthorized } from '@/lib/helper'
// import { getCookie, setCookie } from '@/lib/server'
import { ApiResponse, RequestParams, serverErr } from '@/constants/types'
import { getLocalStorage } from './xLocalStorage'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'

export const throttleAlert = (msg: string) =>
  throttle(() => console.error(msg), 1500, { trailing: false, leading: true })

const handleResponse = async <T>(response: Response, url?: string): Promise<ApiResponse<T>> => {
  if (!response.ok) return serverErr as ApiResponse<T>

  const isClient = typeof window !== 'undefined'
  const data: ApiResponse<T> = await response.json()

  // if (!!url && ['/login'].includes(url)) {
  //   const token = `${(await getSession())?.accessToken}`

  //   setCookie('accessToken', token)
  //   setLocalStorage('accessToken', token)
  // }

  if (data.status !== 200) {
    isClient && addToast({ title: data.message })

    // if (data.status === 401) {
    //   if (isClient) {
    //     unauthorized()
    //   } else {
    //     redirect('/login')
    //   }
    // }
    return data
  }

  return data
}

const fetchWithToken = async (url: string, options: RequestInit) => {
  const token = typeof window !== 'undefined' ? getLocalStorage('accessToken') : (await getServerSession(authOptions))?.accessToken
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}

const upload = async <T>(url: string, file: File): Promise<ApiResponse<T>> => {
  const form = new FormData()
  form.append('file', file)

  const response = await fetchWithToken(`${process.env.NEXTAUTH_URL}${url}`, {
    method: 'POST',
    body: form,
  })

  return handleResponse<T>(response)
}

const post = async <T>({ url, data = {} }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken(`${process.env.NEXTAUTH_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return handleResponse<T>(response, url)
}

const get = async <T>({ url, data, tags }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken(
    `${process.env.NEXTAUTH_URL}${url}${!!stringify(data) ? '?' + stringify(data) : ''}`,
    {
      method: 'GET',
      next: { tags: [tags || ''], revalidate: STALE_TIME * 6 },
    },
  )

  return handleResponse<T>(response)
}

export { get, post, upload }
