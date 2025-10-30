"use server";

import { removeCookies } from "@/utils/cookies";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type TChangePass = { currentPassword: string, newPassword: string }

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export const signUp = async (email: string, password: string, name: string) => {
  if (!name) return { error: "Name is required" };
  if (!password) return { error: "Password is required" };
  if (!email) return { error: "Email is required" };

  await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      callbackURL: "/profile",
    },
    headers: await headers(),
  });

  return { error: null };
};

export const signIn = async (email: string, password: string, rememberMe: boolean) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      rememberMe,
      callbackURL: "/profile",
    },
    headers: await headers(),
  });

  return result;
};

export const signInSocial = async (provider: "github" | "google") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/profile",
    },
  });

  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  await removeCookies('better-auth.session_token');
  await removeCookies('better-auth.state');

  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};

export async function sendVerificationEmailAction(email: string) {
  await auth.api.sendVerificationEmail({ body: { email, callbackURL: '/profile?emailVerified=true' } });
}
export const sendForgotPasswordEmail = async (email: string) => {
  return await auth.api.forgetPassword({ body: { email, redirectTo: '/reset-password' } });
}

export const resetPassword = async (token: string, newPassword: string) => {
  return await auth.api.resetPassword({ body: { token, newPassword } });
}

export const changeEmail = async (newEmail: string) => {
  return await auth.api.changeEmail({ body: { newEmail, callbackURL: '/email-verified' }, headers: await headers() });
}

export const changePassword = async ({ currentPassword, newPassword, }: TChangePass) => {
  const res = await auth.api.changePassword({ body: { currentPassword, newPassword, revokeOtherSessions: false }, headers: await headers() });

  if (res.token) {
    await revokeOtherSessions();
    return { error: null };
  }

  return { error: `There was an error changing your password` };
}

export const updateUser = async ({ name }: { name: string }) => {
  return await auth.api.updateUser({ body: { name }, headers: await headers() });
}

export const updateUserImage = async ({ image }: { image: string }) => {
  return await auth.api.updateUser({ body: { image }, headers: await headers() });
}

// export const updateRole = async ({ role, id }: { role: UserRole, id: string }) => {
//   return await auth.api.setRole({ body: { role, userId: id }, headers: await headers() });
// }

export const listUserAccounts = async () => {
  return await auth.api.listUserAccounts({ headers: await headers() });
}

export const requestPasswordReset = async (email: string) => {
  return auth.api.requestPasswordReset({ body: { email, redirectTo: '/reset-password' } });
}

export const revokeOtherSessions = async () => {
  return auth.api.revokeOtherSessions({ headers: await headers() });
}

export const listAllSessions = async () => {
  return auth.api.listSessions({ headers: await headers() });
}

export const revokeSession = async ({ token }: { token: string }) => {
  return auth.api.revokeSession({ body: { token }, headers: await headers() });
}

export const unlinkAccount = async ({ accountId, providerId }: { accountId: string, providerId: string }) => {
  return auth.api.unlinkAccount({ body: { accountId, providerId }, headers: await headers() });
}

export const deleteAccount = async () => {
  return auth.api.deleteUser({ headers: await headers(), body: { callbackURL: '/' } });
}

export const twoFactorEnable = async (password: string) => {
  return auth.api.enableTwoFactor({ headers: await headers(), body: { password } });
}

export const twoFactorDisable = async (password: string) => {
  return auth.api.disableTwoFactor({ headers: await headers(), body: { password } });
}

export const verifyTOTP = async (token: string) => {
  return auth.api.verifyTOTP({ headers: await headers(), body: { code: token } });
}