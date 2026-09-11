export type ProfileTab = 'profile' | 'addresses' | 'security';
export type Theme = 'light' | 'dark';

export type TAppDataState = {
  theme: Theme;
  currentProfileTab: ProfileTab;
};

export type TUserData = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  image: string | null;
  role: 'USER' | 'SELLER' | 'ADMIN';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TUserDataState = {
  data: TUserData | null;
};
