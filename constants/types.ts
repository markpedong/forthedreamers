import { Users } from '@prisma/client'

export type TSessionUser = Pick<Users, 'id' | 'email' | 'username' | 'password' | 'name'>

// export type TCustomToken = TSessionUser & { accessToken: string }
