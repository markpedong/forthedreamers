"use server";

import { revalidatePath as revalidatePathNext } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { createSupabaseAdminClient, createSupabaseServerClient } from "./supabase/server";

export type TChangePass = { currentPassword: string; newPassword: string };

const unsupported = (feature: string) => ({
  error: `${feature} has not been migrated from Better Auth to Supabase yet.`,
  success: false,
});

export const revalidatePath = async (path: string) => revalidatePathNext(path);

export const getSession = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name:
        (typeof data.user.user_metadata.name === "string" && data.user.user_metadata.name) ||
        data.user.email?.split("@")[0] ||
        "user",
      image:
        typeof data.user.user_metadata.avatar_url === "string"
          ? data.user.user_metadata.avatar_url
          : null,
      emailVerified: Boolean(data.user.email_confirmed_at),
    },
  };
};

export const signUp = async (email: string, password: string, name: string, callbackURL = "/profile") => {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback?next=${callbackURL}`,
      data: { name },
    },
  });

  if (result.error) throw new Error(result.error.message);

  if (result.data.user?.email) {
    await prisma.user.upsert({
      where: { id: result.data.user.id },
      update: { email: result.data.user.email, name },
      create: {
        id: result.data.user.id,
        email: result.data.user.email,
        name,
        emailVerified: Boolean(result.data.user.email_confirmed_at),
      },
    });
  }

  return result.data;
};

export const signIn = async (email: string, password: string) => {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.auth.signInWithPassword({ email, password });
  if (result.error) throw new Error(result.error.message);
  return result.data;
};

export const signInSocial = async (provider: "github" | "google") => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback?next=/profile`,
    },
  });

  if (error) throw new Error(error.message);
  if (data.url) redirect(data.url);
};

export const signOut = async () => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.signOut();
};

export async function sendVerificationEmailAction(email: string) {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback?next=/profile` },
  });
}

export const sendForgotPasswordEmail = async (email: string) => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback?next=/reset-password`,
  });
};

export const resetPassword = async (_token: string, newPassword: string) => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.updateUser({ password: newPassword });
};

export const changeEmail = async (newEmail: string) => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.updateUser({ email: newEmail });
};

export const changePassword = async ({ newPassword }: TChangePass) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error ? { error: error.message } : { error: null };
};

export const updateUser = async ({ name }: { name: string }) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({ data: { name } });

  if (error) throw new Error(error.message);
  if (user) await prisma.user.update({ where: { id: user.id }, data: { name } });
  return { user };
};

export const updateUserImage = async ({ image }: { image: string }) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({ data: { avatar_url: image } });

  if (error) throw new Error(error.message);
  if (user) await prisma.user.update({ where: { id: user.id }, data: { image } });
  return { user };
};

export const listUserAccounts = async () => unsupported("Linked accounts");
export const requestPasswordReset = sendForgotPasswordEmail;
export const revokeOtherSessions = async () => unsupported("Session revocation");
export const listAllSessions = async () => [];
export const revokeSession = async () => unsupported("Session revocation");
export const unlinkAccount = async () => unsupported("Unlink account");
export const deleteAccount = async () => unsupported("Account deletion");
export const twoFactorEnable = async () => unsupported("Two-factor setup");
export const generateBackupCodes = async () => unsupported("Backup codes");
export const listPasskeys = async () => [];
export const deletePasskey = async () => unsupported("Passkey deletion");
export const permissionListUsers = async () => ({ success: true });

export const listUsers = async () => {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(error.message);
  return data.users;
};

export const impersonateUser = async () => unsupported("User impersonation");
export const stopImpersonating = async () => unsupported("User impersonation");
export const banUser = async (userId: string) => prisma.user.update({ where: { id: userId }, data: { banned: true } });
export const unbanUser = async (userId: string) => prisma.user.update({ where: { id: userId }, data: { banned: false } });
export const revokeUserSessions = async () => unsupported("Admin session revocation");

export const deleteUserByAdmin = async (userId: string) => {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  await prisma.user.delete({ where: { id: userId } });
  return { success: true };
};

export const getUserDB = async (userID: string) =>
  prisma.user.findUnique({ where: { id: userID }, select: { role: true } });

export const getProductPrisma = async (slug: string) => await prisma.product.findUnique({
  where: { slug },
  include: {
    specs: {
      omit: { createdAt: true, updatedAt: true, productId: true }
    },
    category: { omit: { createdAt: true, updatedAt: true } },
    variants: {
      omit: { createdAt: true, updatedAt: true, productId: true }
    },
    seller: {
      omit: { createdAt: true, updatedAt: true, id: true, userId: true }
    }
  }
});
