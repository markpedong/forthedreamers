"use server";

import { revalidatePath as revalidatePathNext } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { createSupabaseAdminClient, createSupabaseServerClient } from "./supabase/server";

export type TChangePass = { currentPassword: string; newPassword: string };

const unsupported = (feature: string) => ({
  error: `${feature} is not supported by the Supabase auth setup yet.`,
  success: false,
});

export const revalidatePath = async (path: string) => revalidatePathNext(path);

export const getSession = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { data: sessionData } = await supabase.auth.getSession();

  const profile = await prisma.user.findUnique({
    where: { id: data.user.id },
    select: {
      name: true,
      image: true,
      emailVerified: true,
      role: true,
      twoFactorEnabled: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name:
        profile?.name ||
        (typeof data.user.user_metadata.name === "string" && data.user.user_metadata.name) ||
        data.user.email?.split("@")[0] ||
        "user",
      image:
        profile?.image ??
        (typeof data.user.user_metadata.avatar_url === "string"
          ? data.user.user_metadata.avatar_url
          : null),
      emailVerified: profile?.emailVerified ?? Boolean(data.user.email_confirmed_at),
      role: profile?.role ?? "USER",
      twoFactorEnabled: profile?.twoFactorEnabled ?? false,
      createdAt: profile?.createdAt ?? new Date(data.user.created_at),
      updatedAt: profile?.updatedAt ?? new Date(data.user.updated_at ?? data.user.created_at),
    },
    session: {
      token: sessionData.session?.access_token ?? "",
      impersonatedBy: null as string | null,
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

export const signIn = async (email: string, password: string, _rememberMe?: boolean) => {
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
  if (data.url) redirect(data.url as never);
};

export const signOut = async () => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.signOut();
};

export async function sendVerificationEmailAction(email: string) {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback?next=/profile` },
  });

  return { ...result, status: !result.error };
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

type LinkedAccount = {
  id: string;
  accountId: string;
  providerId: string;
  createdAt: Date | null;
};

export const listUserAccounts = async (): Promise<LinkedAccount[]> => [];
export const requestPasswordReset = sendForgotPasswordEmail;
export const revokeOtherSessions = async () => unsupported("Session revocation");
export const listAllSessions = async () => [];
export const revokeSession = async (_session: { token: string }) => unsupported("Session revocation");
export const unlinkAccount = async (_account: { accountId: string; providerId: string }) => unsupported("Unlink account");
export const deleteAccount = async () => unsupported("Account deletion");
export const twoFactorEnable = async (_password: string) => ({
  ...unsupported("Two-factor setup"),
  totpURI: null as string | null,
  backupCodes: [] as string[],
});
export const generateBackupCodes = async (_password: string) => ({
  ...unsupported("Backup codes"),
  backupCodes: [] as string[],
});
export const listPasskeys = async () => [];
export const deletePasskey = async (_passkeyId: string) => unsupported("Passkey deletion");
export const permissionListUsers = async () => ({ success: true });

export const listUsers = async () => {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  const profiles = await prisma.user.findMany({
    where: { id: { in: data.users.map((user) => user.id) } },
    select: { id: true, name: true, emailVerified: true, role: true, banned: true },
  });
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  return data.users.map((user) => {
    const profile = profileById.get(user.id);

    return {
      ...user,
      name:
        profile?.name ||
        (typeof user.user_metadata.name === "string" && user.user_metadata.name) ||
        user.email?.split("@")[0] ||
        "user",
      email: user.email ?? "",
      emailVerified: profile?.emailVerified ?? Boolean(user.email_confirmed_at),
      role: profile?.role ?? "USER",
      banned: profile?.banned ?? false,
    };
  });
};

export const impersonateUser = async (_userId: string) => unsupported("User impersonation");
export const stopImpersonating = async () => unsupported("User impersonation");
export const banUser = async (userId: string) => prisma.user.update({ where: { id: userId }, data: { banned: true } });
export const unbanUser = async (userId: string) => prisma.user.update({ where: { id: userId }, data: { banned: false } });
export const revokeUserSessions = async (_userId: string) => unsupported("Admin session revocation");

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
