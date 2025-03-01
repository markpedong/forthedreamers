'use server'

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

export const revalidate = async (tag?: string) => revalidateTag(tag || '')

export const setCookie = async (name: string, value: string) => {
  const date = new Date()
  const hours = 12
  date.setTime(date.getTime() + hours * 60 * 60 * 1000) // 12 hours

  const cookiesStore = await cookies()
  cookiesStore.set(name, value, {
    expires: date,
    path: '/',
    sameSite: 'lax',
    secure: false,
    httpOnly: false,
    maxAge: hours * 60 * 60,
  })
}

export const getCookie = async (name: string) => {
  const cookieStore = await cookies()

  cookieStore.get(name)?.value || ''
}
