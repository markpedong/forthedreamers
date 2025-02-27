import prisma from '@/db'
import NextAuth, { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/utils/tokens'

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) throw new Error('Email and password are required')

        const user = await prisma.users.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) throw new Error('Invalid credentials')

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)
        if (!isCorrectPassword) throw new Error('Invalid credentials')

        return user
      }
    }),
    GoogleProvider({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`
    })
  ],
  secret: `${process.env.AUTH_SECRET}`,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        let existingUser = await prisma.users.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          existingUser = await prisma.users.create({
            data: {
              firstName: user.name?.split(' ')[0],
              lastName: user.name?.split(' ')[1],
              email: user.email!,
              username: user.email!.replace('@gmail.com', ''),
              image: user.image!,
              password: ''
            }
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.users.findUnique({
          where: { email: user.email! }
        })
        if (!dbUser) throw new Error('User not found in database')

        const accessToken = generateAccessToken(dbUser.id, `${dbUser.email}`)
        const refreshToken = generateRefreshToken()

        await prisma.users.update({
          where: { id: dbUser.id },
          data: { refreshToken }
        })

        token.id = dbUser.id
        token.accessToken = accessToken
        token.refreshToken = refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        email: `${token.email}`
      }
      session.accessToken = `${token.accessToken}`

      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
