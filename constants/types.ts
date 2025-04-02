import { Products, Users, Variations, Wishlists } from '@prisma/client'
import { GetProp, UploadProps } from 'antd'

export type TSessionUser = Pick<Users, 'id' | 'email' | 'username' | 'password' | 'firstName' | 'lastName' | 'role'>

export type TCustomToken = TSessionUser & { accessToken: string }

export type TDecodedToken = Pick<Users, 'id' | 'email' | 'firstName' | 'lastName'>

export type ApiResponse<T> = {
  data: T
  error?: any
  status?: number
  success: boolean
  message?: string
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type FormState<T> = {
  errors?: Record<string, string[]>
  values?: T
  success?: boolean
  message?: string
}

export enum LOGINFORM_STATE {
  USER_REGISTER = 'register',
  USER_LOGIN = 'login',
  FORGOT_PASSWORD = 'forgot-password',
  SELLER_REGISTER = 'seller-register',
  SELLER_LOGIN = 'seller-login'
}

export type UserItem = {
  id: string
  email: string | null
  username: string
  firstName: string | null
  lastName: string | null
  image: string | null
  password: string
  refreshToken: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export const serverErr = {
  message: 'server error',
  data: {},
  status: 500,
  success: false
} satisfies ApiResponse<any>

export type RequestParams = {
  url: string
  data?: any
  tags?: string
  isJSON?: boolean
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export type TAddTailwindUtility = {
  addUtilities: (utilities: any) => void
  addComponents: (components: any) => void
}

export type TWishListItem = Wishlists & {
  product: {
    price: number
    stock: number
    images: string[]
    name: string
  }
}
export type TProductItem = Products & {
  variations: TVariationItem[]
}

export type TVariationItem = {
  id: string
  label: string
  stock: number
  price: number
  discountedPrice: number
  productId: String
}

export type TSellerItem = Users & {
  _count: { products: number }
}

export type SellerInfo = {
  id: string
  email: string
  username: string
  phoneNumber: string
  password: string
  role: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  firstName: string
  lastName: string
  image: string
  refreshToken: string
  birthday: any
  storeName: string
  products: TProductItem[]
}

export type AddProductModalProps = {
  isOpen: boolean
  onClose: () => void
  product?: TProductItem
}

export type AddToCartHandler = {
  productId: string
  variationId: string
  quantity: number
  userId: string
}

export type CartResponse = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    images: string[]
  }
  variation: {
    id: string
    label: string
    price: number
    discountedPrice: number
  }
}

export type SearchProductItem = {
  name: string;
  id: string;
  images: string[];
  variations: {
    price: number;
    discountedPrice: number | null;
  }[];
}[]

export type TCartItem = { id: string; quantity: number }

export type CookieOptions = {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  expires?: Date;
};

export type TCheckoutPayload = { ids: string[], address?: string, payment?: string }