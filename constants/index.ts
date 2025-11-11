import { AppleIcon, FacebookIcon, GoogleIcon, TikTokIcon } from "@/components/icons/oauth";
import { PRODUCT_STATUS } from "@/generated/prisma";
import { ComponentProps, ElementType } from "react";

export const OAUTH_PROVIDERS = ["google", "github", "facebook", "tiktok"] as const
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]

export const OAUTH_PROVIDER_DETAILS: Record<OAuthProvider, { name: string; Icon: ElementType<ComponentProps<"svg">> }> = {
  google: { name: "Google", Icon: GoogleIcon },
  github: { name: "Apple", Icon: AppleIcon },
  facebook: { name: "Facebook", Icon: FacebookIcon },
  tiktok: { name: "TikTok", Icon: TikTokIcon },

}

export const CHANGE_PASSWORD_DEFAULT = { currentPassword: '', confirmPassword: '', newPassword: '' }

export const TWOFACTOR_DEFAULT = { password: '', otp: '' }

export const ALLOWED_KEYS = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete']

export const PRODUCT_DEFAULT = {
  name: '',
  brand: '',
  category: '',
  description: '',
  basePrice: null,
  stock: null,
  status: PRODUCT_STATUS.DRAFT,
  variants: [] as any[],
  specs: [] as any[],
  tags: [] as string[],
  images: [] as string[],
};


export const LABEL_VALUE_DEFAULT = {
  id: undefined as string | undefined,
  label: '',
  value: '',
}

export const DISABLED_NAVBAR = ['/sign-in', '/reset-password', '/seller', '/products', '/users', '/dashboard', '/categories']

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const STALE_TIME = 1000 * 60 * 10 // 10 minutes

export const VARIANT_ITEM_DEFAULT = { name: '', isRequired: true };

export const VARIANT_OPTION_DEFAULT = {
  variantOptionName: '',
  coupon: '',
  price: 0,
  discountedPrice: null,
  stock: 0
}