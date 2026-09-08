export type ProfileTab = 'profile' | 'addresses' | 'security'
export type Theme = 'light' | 'dark'

export type TAppDataState = {
  theme: Theme
  currentProfileTab: ProfileTab
}

export type TCartDataState = {
  cartCount: number
}

export type TUserData = {
  id: string
  name: string
  email: string
  image: string | null
  role: 'USER' | 'SELLER' | 'ADMIN'
  emailVerified: boolean
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

export type TUserDataState = {
  data: TUserData | null
}
