import prisma from '@/db';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { TCustomToken } from '@/constants/types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/constants';
import { generateRefreshToken, generateAccessToken } from '@/utils/tokens';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) throw new Error('Email and password are required');

        const user = await prisma.users.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) throw new Error('Invalid credentials');

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isCorrectPassword) throw new Error('Invalid credentials');

        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);

        await prisma.users.update({
          where: { id: user.id },
          data: { refreshToken }
        });

        return {
          ...user,
          accessToken,
          refreshToken,
        };
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
        });

        if (!existingUser) {
          existingUser = await prisma.users.create({
            data: {
              firstName: user.name?.split(' ')[0],
              lastName: user.name?.split(' ')[1] || '',
              email: user.email!,
              username: user.email!.replace('@gmail.com', ''),
              image: user.image!,
              password: '',
            }
          });
        }

        const refreshToken = generateRefreshToken(existingUser!);

        await prisma.users.update({
          where: { id: existingUser!.id },
          data: { refreshToken }
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }

      const existingUser = await prisma.users.findUnique({
        where: { id: token.id as string }
      });

      if (!existingUser) throw new Error('User not found');

      const newAccessToken = generateAccessToken(existingUser);
      return { ...token, accessToken: newAccessToken };
    },
    async session({ session, token }) {
      session.user = { ...session.user, ...token };
      token.accessToken as string | undefined
      return session;
    },
  }
};

export default authOptions;
