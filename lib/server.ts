'use server'

import authOptions from '@/app/api/auth/[...nextauth]/options'
import { TAGS } from '@/constants'
import { CartResponse, TCartItem } from '@/constants/types'
import prisma from '@/db'
import { get, patch } from '@/utils/http'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export const refetch = async (tag?: string) => revalidateTag(`${tag}`);

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

export const getAllProducts = async () => {
  return prisma.products.findMany({
    where: { deletedAt: null },
    include: { variations: true },
    orderBy: { createdAt: 'desc' }
  })
}

export const getAllSellers = async () => {
  return prisma.users.findMany({
    include: {
      products: {
        include: {
          variations: true
        },
        where: { deletedAt: null }
      }
    }
  })
}
export const getSoldProducts = async (id?: string) => {
  return await prisma.orders.findMany({
    where: {
      orderItems: {
        some: {
          product: {
            sellerID: id
          }
        }
      }
    },
    include: {
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export const getProductReviews = async (id?: string) => {
  return await prisma.reviews.findMany({
    where: {
      product: {
        sellerID: id
      }
    },
    include: {
      product: true,
      user: true,
      order: true
    }
  })
}

export const getServerToken = async () => {
  const session = await getServerSession(authOptions);

  return session?.accessToken
}

export const getCartItems = async (id?: string) => get<CartResponse[]>({ url: `/api/cart/${id}`, tags: TAGS.CART })

export const updateCartItems = async (body: TCartItem[]) => patch<CartResponse[]>({ url: '/api/cart', data: body })