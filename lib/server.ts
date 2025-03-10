'use server'

import { AddToCartHandler } from '@/constants/types'
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
    include: {
      variations: true,
      reviews: true,
      seller: {
        omit: {
          email: true,
          username: true,
          phoneNumber: true,
          password: true,
          role: true,
          updatedAt: true,
          deletedAt: true,
          firstName: true,
          lastName: true,
          refreshToken: true,
          birthday: true
        },
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      }
    }
  })
}

export const getProducts = async () => {
  return prisma.products.findMany({
    where: {
      deletedAt: null,
      AND: {
        seller: { storeName: { not: null } }
      }
    },
    select: { id: true, name: true, images: true, variations: { select: { price: true, discountedPrice: true } } },
    orderBy: { createdAt: 'desc' }
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