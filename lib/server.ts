'use server'

import authOptions from '@/app/api/auth/[...nextauth]/options'
import { TAGS } from '@/constants'
import { CartResponse, CookieOptions, TCartItem, TOrdersResponse, TReviewItem, TReviewPayload, TWishListItem } from '@/constants/types'
import prisma from '@/db'
import { get, patch, post } from '@/utils/http'
import { Addresses, PaymentMethods, Reviews } from '@prisma/client'
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
      user: { select: { firstName: true, lastName: true } },
      orderItems: {
        include: { product: { select: { name: true, id: true, images: true } } }
      },
      address: true
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
    select: {
      id: true,
      comment: true,
      rating: true,
      product: { select: { name: true } },
      user: { select: { firstName: true, lastName: true, image: true } },
      createdAt: true
    }
  })
}

export const getServerToken = async () => {
  const session = await getServerSession(authOptions);

  return session?.accessToken
}

export const getCartItems = async (id?: string) => get<CartResponse[]>({ url: `/api/cart/${id}`, tags: TAGS.CART })

export const updateCartItems = async (body: TCartItem[]) => patch<CartResponse[]>({ url: '/api/cart', data: body })

export const getOrders = async (id: string) => get<TOrdersResponse[]>({ url: `/api/orders/${id}`, tags: TAGS.ORDERS })

export const getWishlist = async (id: string) => get<TWishListItem[]>({ url: `/api/wishlist/${id}`, tags: TAGS.WISHLIST })

export const getReviews = async (id: string) => get<TReviewItem[]>({ url: `/api/reviews/${id}`, tags: TAGS.REVIEWS })

export const getAddress = async (id: string) => get<Addresses[]>({ url: `/api/address/${id}`, tags: TAGS.ADDRESS })

export const getPaymentMethod = async (id: string) => get<PaymentMethods[]>({ url: `/api/payment-methods/${id}`, tags: TAGS.PAYMENT_METHODS })

export const submitReview = async (data: TReviewPayload[]) => post({ url: "/api/reviews", data })