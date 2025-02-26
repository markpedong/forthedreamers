import prisma from '@/db'
import NextAuth, { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import { TSessionUser } from '@/constants/types'

const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) throw new Error('Email and password are required')

        const user = await prisma.users.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) throw new Error('Invalid credentials')

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)
        if (!isCorrectPassword) throw new Error('Invalid credentials')

        return {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  secret: `${process.env.NEXTAUTH_SECRET}`,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      const { ...resToken } = token as TSessionUser
      session.user = { ...session.user, ...resToken }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
