'use server'

import prisma from '@/db'
import { validateUUID } from '@/utils/helpers'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

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
    maxAge: hours * 60 * 60
  })
}

export const getCookie = async (name: string) => {
  const cookieStore = await cookies()

  cookieStore.get(name)?.value || ''
}

export const getProfileServer = async (id?: string, isSeller?: boolean) => {
  return prisma.users.findUnique({
    where: { id },
    ...(isSeller && {
      include: {
        products: true,
      }
    })
  })
}

export const getAddressesServer = async (id?: string) => {
  return prisma.addresses.findMany({
    where: { userId: id, deletedAt: null },
    orderBy: { createdAt: 'desc' }
  })
}

export const getPaymentMethodServer = async (id?: string) => {
  return prisma.paymentMethods.findMany({
    where: { userId: id, deletedAt: null },
    orderBy: { createdAt: 'desc' }
  })
}

export const getOrderServer = async (id?: string) => {
  return prisma.orders.findMany({
    where: { userId: id, deletedAt: null },
    orderBy: { createdAt: 'desc' }
  })
}

export const getReviewServer = async (id?: string) => {
  return prisma.reviews.findMany({
    where: { userId: id, deletedAt: null },
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

export const getWishlistServer = async (id?: string) => {
  return prisma.wishlists.findMany({
    where: { userId: id },
    include: { product: { select: { images: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

export const getProductDetails = async (id?: string) => {
  if (!validateUUID(`${id}`)) return null

  return prisma.products.findUnique({
    where: { id, deletedAt: null },
    include: { variations: true }
  })
}

export const getProducts = async () => {
  return prisma.products.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, images: true, variations: { select: { price: true, discountedPrice: true } } },
    orderBy: { createdAt: 'desc' }
  })
}
