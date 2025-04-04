import { ApiResponse, CartResponse, DateFormat, TDecodedToken, TProductItem, TReviewItem } from '@/constants/types'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { uuidSchema } from '@/lib/rules'
import { JWT_SECRET } from '@/constants'
import { PAYMENT_TYPE, PaymentMethods } from '@prisma/client'
import { DateFormatter } from '@internationalized/date'

export const generateResponse = <T>({
  data = null,
  error,
  status = 200,
  message = '',
  meta
}: Partial<Omit<ApiResponse<T | null>, 'success'>>) => {
  const success = status >= 200 && status < 300
  if (!success) console.error('API ERROR', error || message)
  return NextResponse.json({ data, error, success, status, message, meta }, { status })
}

export const validateToken = (token: string) => {
  if (!token) return { valid: false, error: 'Authorization token missing' }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { valid: true, decoded }
  } catch (error) {
    return { valid: false, error: `Invalid or expired token: ${error}` }
  }
}

export const isAuthenticated = async (request: NextRequest) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') || ''
  try {
    const { valid } = validateToken(token)
    if (!valid) return generateResponse({ status: 401, message: 'Unauthorized' })
    else {
      const decoded = jwt.verify(token, JWT_SECRET) as TDecodedToken
      return generateResponse({ data: decoded })
    }
  } catch (error) {
    return generateResponse({ error, status: 500, message: 'Server error' })
  }
}

export const validateUUID = (id: string) => {
  const result = uuidSchema.safeParse(id)
  return result.success
}

export const calculateDiscountPercentage = (price: number, discountedPrice?: number): number | null => {
  if (!discountedPrice || discountedPrice >= price) return null

  const discount = ((price - discountedPrice) / price) * 100
  return Math.round(discount)
}

export const getCardIcon = (type: PaymentMethods['type']) => {
  switch (type) {
    case PAYMENT_TYPE.VISA:
      return 'logos:visa'
    case PAYMENT_TYPE.MASTERCARD:
      return 'logos:mastercard'
    case PAYMENT_TYPE.PAYPAL:
      return 'logos:paypal'
    case PAYMENT_TYPE.APPLEPAY:
      return 'logos:apple-pay'
    default:
      return 'lucide:credit-card'
  }
}

export const dateFormatter = (createdAt: string | Date, format: DateFormat = 'full') => {
  const date = new Date(createdAt)

  const formatter =
    format === 'monthYear'
      ? new DateFormatter('en-US', { year: 'numeric', month: 'long' })
      : format === 'monthDayYear'
      ? new DateFormatter('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : new DateFormatter('en-US', { dateStyle: 'long', timeStyle: 'short' })

  return formatter.format(date)
}

export const calculateAverageRating = (reviews: TReviewItem[]) =>
  reviews.length ? Math.round((reviews.reduce((sum, { rating }) => sum + rating, 0) / reviews.length) * 10) / 10 : 0

export const calculateSellerRating = (data: TProductItem[]) => {
  const allRatings = data.flatMap(products => products.reviews.map(r => r.rating))

  return allRatings.length ? Math.round((allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length) * 10) / 10 : 0
}

export const cartItemsLength = (cartItems: CartResponse[]) => cartItems?.reduce((acc, item) => acc + item.quantity, 0)

export const cartSubTotal = (cartItems: CartResponse[]) =>
  cartItems?.reduce((sum, item) => sum + item.variation.price * item.quantity, 0)
