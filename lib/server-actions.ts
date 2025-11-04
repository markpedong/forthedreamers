"use server";

import { removeCookies } from "@/utils/cookies";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { revalidatePath as revalidatePathNext } from "next/cache";

export type TChangePass = { currentPassword: string, newPassword: string }

export const revalidatePath = async (path: string) => revalidatePathNext(path)

export const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export const signUp = async (email: string, password: string, name: string) => {
  if (!name) return { error: "Name is required" };
  if (!password) return { error: "Password is required" };
  if (!email) return { error: "Email is required" };

  return await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },

    headers: await headers(),
  });
};

export const signIn = async (email: string, password: string, rememberMe: boolean) => {

  return await auth.api.signInEmail({
    body: {
      email,
      password,
      rememberMe,
      callbackURL: "/profile",
    },
    headers: await headers(),
  });
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

export const generateBackupCodes = async (password: string) => {
  return auth.api.generateBackupCodes({ headers: await headers(), body: { password } });
}

export const listPasskeys = async () => {
  return auth.api.listPasskeys({ headers: await headers() });
}

export const deletePasskey = async (id: string) => {
  return auth.api.deletePasskey({ headers: await headers(), body: { id } });
}

export const permissionListUsers = async () => {
  return auth.api.userHasPermission({ headers: await headers(), body: { permission: { user: ["list"] } } });
}

export const listUsers = async () => {
  return auth.api.listUsers({ headers: await headers(), query: {} });
}

export const impersonateUser = async (userId: string) => auth.api.impersonateUser({ headers: await headers(), body: { userId } });

export const stopImpersonating = async () => auth.api.stopImpersonating({ headers: await headers() });

export const banUser = async (userId: string) => auth.api.banUser({ headers: await headers(), body: { userId } });

export const unbanUser = async (userId: string) => auth.api.unbanUser({ headers: await headers(), body: { userId } });

export const revokeUserSessions = async (userId: string) => auth.api.revokeUserSessions({ headers: await headers(), body: { userId } });

export const deleteUserByAdmin = async (userId: string) => auth.api.removeUser({ headers: await headers(), body: { userId } });