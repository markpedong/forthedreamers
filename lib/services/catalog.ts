import 'server-only'

import {Prisma} from '@/generated/prisma'
import {cached} from '@/lib/cache'
import {cacheKeys} from '@/lib/cache-keys'
import prisma from '@/lib/prisma'

export const cardSelect = {
  id: true,
  name: true,
  images: true,
  basePrice: true,
  slug: true,
  variants: {select: {price: true}, orderBy: {createdAt: 'asc'}, take: 1}
} satisfies Prisma.ProductSelect

export const homeProducts = () => cached('catalog', cacheKeys.home, 60, () => prisma.product.findMany({
  where: {status: 'ACTIVE'},
  select: cardSelect,
  orderBy: [{createdAt: 'desc'}, {id: 'asc'}],
  take: 24
}))

export const productSlugs = () => cached('catalog', cacheKeys.productSlugs, 60, () => prisma.product.findMany({
  where: {status: 'ACTIVE'},
  select: {slug: true},
  orderBy: [{createdAt: 'desc'}, {id: 'asc'}],
  take: 24
}))

export const publicCategories = () => cached('catalog', cacheKeys.categories, 3600, () => prisma.category.findMany({
  select: {id: true, name: true},
  orderBy: {name: 'asc'}
}))

// Stock is present for the variant picker; keep the display TTL at 60 seconds.
export const productBySlug = (slug: string) => cached('catalog', cacheKeys.product(slug), 60, () => prisma.product.findFirst({
  where: {slug, status: 'ACTIVE'},
  select: {
    id: true,
    name: true,
    brand: true,
    basePrice: true,
    images: true,
    variants: {select: {id: true, name: true, stock: true, price: true, discountedPrice: true, coupon: true, image: true, attributes: true}}
  }
}))
