'use server'

import authOptions from '@/app/api/auth/[...nextauth]/options'
import { TAGS } from '@/constants'
import { CartResponse, CookieOptions, TCartItem, TOrderItems } from '@/constants/types'
import prisma from '@/db'
import { get, patch } from '@/utils/http'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export const refetch = async (tag?: string) => revalidateTag(`${tag}`);

export const setCookie = async (name: string, value: string, options?: CookieOptions) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust SameSite as needed
    ...options,
  });
}

export const getCookie = async (name: string) => {
  const cookieStore = await cookies()

  return cookieStore.get(name)?.value || ''
}

export const removeServerCookie = async (name: string) => {
  const cookieStore = await cookies();

  cookieStore.delete(name);
};

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

export const getOrders = async (id: string) => get<TOrderItems[]>({ url: `/api/orders/${id}`, tags: TAGS.ORDERS })