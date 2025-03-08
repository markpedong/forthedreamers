import { DefaultSession } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'
import { TSessionUser } from './constants/types'
import { USER_ROLE } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: TSessionUser & { refreshToken?: string };
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role: string
  }
}
