'use server'

import authOptions from '@/app/api/auth/[...nextauth]/options'
import { AddToCartHandler } from '@/constants/types'
import prisma from '@/db'
import { validateUUID } from '@/utils/helpers'
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

export const getProfileServer = async (id?: string, isSeller?: boolean) => {
  return prisma.users.findUnique({
    where: { id },
    ...(isSeller && {
      include: {
        products: true
      }
    })
  })
}

export const getProductserver = async (id?: string) => {
  return prisma.products.findMany({
    where: { sellerID: id, deletedAt: null },
    include: { variations: true },
    orderBy: { createdAt: 'desc' }
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

export const getCartItems = async (id?: string) => {
  return prisma.carts.findMany({
    where: { userId: id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true
        }
      },
      variation: {
        select: {
          id: true,
          label: true,
          price: true,
          discountedPrice: true
        }
      }
    },
    omit: {
      createdAt: true,
      deletedAt: true,
      updatedAt: true,
      productId: true,
      variationId: true,
      userId: true
    }
  })
}

export const updateCartInDatabase = async (cartItems: { id: string; quantity: number }[]) => {
  const updateOperations = cartItems.map(item =>
    prisma.carts.update({
      where: { id: item.id },
      data: { quantity: item.quantity }
    })
  )

  return prisma.$transaction(updateOperations)
}

export const removeItemFromCart = async (id: string) => {
  return prisma.carts.delete({
    where: { id }
  })
}

export const addItemToCart = async ({ productId, quantity, userId, variationId }: AddToCartHandler) => {
  const existingCart = await prisma.carts.findFirst({
    where: {
      productId,
      variationId,
      userId: userId
    }
  })

  if (existingCart) {
    await prisma.carts.update({
      where: { id: existingCart.id },
      data: {
        quantity: existingCart.quantity + 1
      }
    })
  } else {
    await prisma.carts.create({
      data: {
        productId,
        quantity,
        variationId,
        userId: userId
      }
    })
  }
}

export const getServerToken = async () => {
  const session = await getServerSession(authOptions);
  return session?.accessToken
}
