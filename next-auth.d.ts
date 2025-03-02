import { DefaultSession } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'
import { TSessionUser } from './constants/types'

declare module 'next-auth' {
  interface Session {
    user: TSessionUser & { refreshToken?: string };
    accessToken?: string;
  }
}
