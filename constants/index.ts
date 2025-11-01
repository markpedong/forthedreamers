import { AppleIcon, FacebookIcon, GoogleIcon, TikTokIcon } from "@/components/icons/oauth";
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