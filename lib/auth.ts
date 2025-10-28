import { betterAuth } from "better-auth";
import prisma from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import transporter from "./nodemailer";
import ResetPassword from "@/components/emails/reset-password";
import { render } from "@react-email/render";
import VerifyEmail from "@/components/emails/verify-email";
import { lastLoginMethod } from 'better-auth/plugins';
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const html = await render(
        ResetPassword({
          userName: user.name,
          resetUrl: url,
          userEmail: user.email,
        })
      );

      await transporter.sendMail({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "Reset your password",
        html: html,
      });
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    // autoSignInAfterVerification: false,
    // expiresIn: 3600 // 1hour
    sendVerificationEmail: async ({ user, url }) => {
      const html = await render(VerifyEmail({ username: user.name, verifyUrl: url }));

      await transporter.sendMail({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "Please verify your email",
        html: html,
      });
    },
  },
  plugins: [
    lastLoginMethod(),
    nextCookies(),
  ]
});