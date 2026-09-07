export type ProfileTab = 'profile' | 'addresses' | 'security'

export type TAppDataState = {
  theme: string | null
  currentProfileTab: ProfileTab | null
}

export type TCartDataState = {
  cartCount: number
}
