import prisma from '@/db'
import NextAuth, { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/constants'
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

        const { id, firstName, lastName, email, username } = user

        const accessToken = jwt.sign(
          { id, firstName, lastName, email, username },
          JWT_SECRET,
          { expiresIn: '1d' },
        );


        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          accessToken
        }
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
        const existingUser = await prisma.users.findUnique({
          where: { email: `${user.email}` }
        })

        if (!existingUser) {
          await prisma.users.create({
            data: {
              firstName: user.name?.split(' ')[0],
              lastName: user.name?.split(' ')[1],
              email: user.email,
              username: `${user.email?.replace('@gmail.com', '')}`,
              image: user.image,
              password: '',
            }
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        if (account?.access_token) {
          token.access_token = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const { ...resToken } = token
      session.user = { ...session.user, ...resToken }
      session.access_token = (token as any).access_token
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
