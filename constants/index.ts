import { ADDRESS_TYPE, PAYMENT_TYPE } from '@prisma/client'

export const NO_NAVBAR_FOOTER_PAGES = ['/login', '/checkout', '/forgot-password', '/signup']

export const JWT_SECRET = `${process.env.JWT_SECRET}`

export const AUTH_SECRET = `${process.env.AUTH_SECRET}`

export const FOOTER_TITLE = ['Exclusive', 'Support', 'Account', 'Quick Link', 'Download App']

export const STALE_TIME = 1000 * 60 * 10

export const OPTIONS_ADDRESS = [
  {
    label: ADDRESS_TYPE.HOME,
    key: ADDRESS_TYPE.HOME
  },
  {
    label: ADDRESS_TYPE.WORK,
    key: ADDRESS_TYPE.WORK
  },
  {
    label: ADDRESS_TYPE.NONE,
    key: ADDRESS_TYPE.NONE
  }
]

export const ADDRESS_OBJ = {
  [ADDRESS_TYPE.HOME]: 'HOME',
  [ADDRESS_TYPE.WORK]: 'WORK',
  [ADDRESS_TYPE.NONE]: 'NONE',
  [ADDRESS_TYPE.DEFAULT]: 'DEFAULT'
}

export const PAYMENT_METHODS = [
  {
    label: 'Cash on Delivery',
    key: PAYMENT_TYPE.CASH_ON_DELIVERY,
    icon: 'famicons:cash-outline'
  },
  {
    label: 'PayPal',
    key: PAYMENT_TYPE.PAYPAL,
    icon: 'logos:paypal'
  },
  {
    label: 'Apple Pay',
    key: PAYMENT_TYPE.APPLEPAY,
    icon: 'logos:apple-pay'
  },
  {
    label: 'Visa',
    key: PAYMENT_TYPE.VISA,
    icon: 'logos:visa'
  },
  {
    label: 'Mastercard',
    key: PAYMENT_TYPE.MASTERCARD,
    icon: 'logos:mastercard'
  }
]

export const DEFAULT_VARIATION = { label: '', stock: 0, price: 0, discountedPrice: 0, productId: '', id: '' }
