import { STALE_TIME } from '@/constants'
import { stringify } from 'qs'
import { addToast } from '@heroui/react'
import { ApiResponse, RequestParams, serverErr } from '@/constants/types'
import { getLocalStorage, setLocalStorage } from './xLocalStorage'
import { getSession } from 'next-auth/react'
import { refreshToken } from './request'
import { getServerToken } from '@/lib/server'

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) return serverErr as ApiResponse<T>

  const data: ApiResponse<T> = await response.json()

  if (data.status !== 200) {
    typeof window !== 'undefined' ? addToast({ title: data.message }) : console.error(data.message)
    return data
  }

  return data
}

const fetchWithToken = async ({
  url,
  options,
  attempt = 1,
  accessToken
}: {
  url: string
  options: RequestInit
  attempt?: number
  accessToken?: string
}): Promise<Response> => {
  let token = accessToken;

  if (typeof window !== "undefined") {
    token = getLocalStorage("accessToken") || (await getSession())?.accessToken;
  } else {
    token = await getServerToken()
  }

  // if (!token) {
  //   throw new Error("Unauthorized: No access token found.");
  // }

  const response = await fetch(`${process.env.NEXTAUTH_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      ...token && { Authorization: `Bearer ${token}` },
    },
    credentials: "include",
  });

  if (response.status !== 401) return response;


  if (!!token) {
    if (attempt >= 2) {
      throw new Error("Unauthorized: Refresh token is invalid or missing.");
    }

    const tokenRes = await refreshToken();
    if (!tokenRes?.data?.accessToken) {
      throw new Error("Failed to refresh token. Stopping requests.");
    }

    if (typeof window !== "undefined") {
      setLocalStorage("accessToken", tokenRes.data.accessToken);
    }

    return fetchWithToken({
      url,
      options,
      attempt: attempt + 1,
      accessToken: tokenRes.data.accessToken
    });
  } else return response
};


const upload = async <T>(url: string, file: File): Promise<ApiResponse<T>> => {
  const form = new FormData()
  form.append('file', file)

  const response = await fetchWithToken({
    url,
    options: {
      method: 'POST',
      body: form
    }
  })

  return handleResponse<T>(response)
}

const post = async <T>({ url, data = {}, isJSON = true }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken({
    url,
    options: {
      method: 'POST',
      ...isJSON && { headers: { 'Content-Type': 'application/json' } },
      body: isJSON ? JSON.stringify(data) : data
    }
  })

  return handleResponse<T>(response)
}

const get = async <T>({ url, data, tags }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken({
    url: `${url}${!!stringify(data) ? '?' + stringify(data) : ''}`,
    options: {
      method: 'GET',
      next: { tags: tags ? [tags] : [], revalidate: STALE_TIME * 60 },
      cache: 'force-cache'
    }
  })

  return handleResponse<T>(response)
}

const deleteF = async <T>({ url, data = {} }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken({
    url,
    options: {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  })

  return handleResponse<T>(response)
}

const patch = async <T>({ url, data = {}, isJSON = true }: RequestParams): Promise<ApiResponse<T>> => {
  const response = await fetchWithToken({
    url,
    options: {
      method: 'PATCH',
      ...isJSON && { headers: { 'Content-Type': 'application/json' } },
      body: isJSON ? JSON.stringify(data) : data
    }
  })

  return handleResponse<T>(response)
}

export { get, post, upload, deleteF, patch }
