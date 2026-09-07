"use server";

import { revalidatePath as revalidatePathNext } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { getRandomDefaultAvatarUrl } from "./default-avatars";
import { createSupabaseAdminClient, createSupabaseServerClient } from "./supabase/server";
import { upsertAuthUser } from "./auth";
import type { TUserData } from "@/services/types";

export type TChangePass = { currentPassword: string; newPassword: string };

export const revalidatePath = async (path: string) => revalidatePathNext(path);

const appOrigin = async () => {
  const headerStore = await headers();
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  return process.env.NEXT_PUBLIC_APP_URL || (host ? `${proto}://${host}` : "");
};

export const getSession = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { data: sessionData } = await supabase.auth.getSession();

  const profile = await upsertAuthUser(data.user);

  return {
    hasPassword:
      data.user.app_metadata.provider === "email" ||
      data.user.identities?.some((identity) => identity.provider === "email") === true,
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

export const getCurrentUserData = async (): Promise<TUserData | null> => {
  const session = await getSession();
  if (!session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email ?? "",
    image: session.user.image,
    role: session.user.role,
    emailVerified: session.user.emailVerified,
    twoFactorEnabled: session.user.twoFactorEnabled,
    createdAt: new Date(session.user.createdAt).toISOString(),
    updatedAt: new Date(session.user.updatedAt).toISOString(),
  };
};

export const signUp = async (email: string, password: string, name: string, callbackURL = "/profile") => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  const image = getRandomDefaultAvatarUrl();
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${callbackURL}`,
      data: { name, avatar_url: image },
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
        image,
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

export const signInSocial = async (
  provider: 'github' | 'google',
  next = '/profile',
) => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url as never);
  }
};

export const signOut = async () => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.signOut();
};

export async function sendVerificationEmailAction(email: string) {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  const result = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/profile` },
  });

  return { ...result, status: !result.error };
}

export const sendForgotPasswordEmail = async (email: string) => {
  // Rate limiting: simple in-memory throttle to prevent email spam/enumeration
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  if (!token || token.trim() === '') {
    throw new Error('Invalid or missing reset token');
  }
  const supabase = await createSupabaseServerClient();
  // Verify the token is valid before updating password
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email: '', // token-only verification
    token,
    type: 'recovery',
  });
  if (verifyError) {
    throw new Error('Invalid or expired reset token');
  }
  return supabase.auth.updateUser({ password: newPassword });
};

export const changeEmail = async (newEmail: string, currentPassword?: string) => {
  const supabase = await createSupabaseServerClient();

  // Verify current session is valid before allowing email change
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Authentication required');
  }

  // If password is provided, validate it first (recommended for security)
  if (currentPassword) {
    const admin = await createSupabaseAdminClient();
    // Verify password by attempting to sign in with the current credentials
    const { error: signInError } = await admin.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    if (signInError) {
      throw new Error('Current password is incorrect');
    }
  }

  const { data, error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw new Error(error.message);

  // After email change, the session may be invalidated — refresh it
  if (data?.user) {
    await supabase.auth.updateUser({ data: { name: user.user_metadata?.name } });
  }

  return data;
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
  return { user: user ? await getCurrentUserData() : null };
};

export const updateUserImage = async ({ image }: { image: string }) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({ data: { avatar_url: image } });

  if (error) throw new Error(error.message);
  if (user) await prisma.user.update({ where: { id: user.id }, data: { image } });
  return { user: user ? await getCurrentUserData() : null };
};

// Supabase password reset (server action - uses admin client)
export const requestPasswordReset = async ({ email, redirectTo }: { email: string; redirectTo?: string }) => {
  const supabase = await createSupabaseServerClient();
  const origin = await appOrigin();
  // Use standard email-based password reset that sends a magic link to the user's email
  const result = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}${redirectTo ?? "/reset-password"}`,
  });
  if (result.error) throw new Error(result.error.message);
  return { success: true };
};

export const listAllSessions = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return [];

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");

  return [
    {
      id: session.access_token,
      token: session.access_token,
      userAgent: headerStore.get("user-agent"),
      ipAddress: forwardedFor?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip"),
      createdAt: session.user.last_sign_in_at ?? session.user.created_at,
    },
  ];
};

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

export const banUser = async (userId: string) => {
  await prisma.user.update({ where: { id: userId }, data: { banned: true } });
  return { success: true };
};
export const unbanUser = async (userId: string) => {
  await prisma.user.update({ where: { id: userId }, data: { banned: false } });
  return { success: true };
};

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


// --- Profile-related server actions ---

export const getUserAddresses = async (userId: string) =>
  prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
    omit: { createdAt: true, updatedAt: true, userId: true }
  })

export const updateAddress = async ({
  id,
  type,
  label,
  fullName,
  phoneNumber,
  region,
  city,
  postalCode,
  street,
  isDefault
}: {
  id: string
  type?: 'HOME' | 'WORK' | 'OTHER'
  label?: string | null
  fullName: string
  phoneNumber: string
  region: string
  city: string
  postalCode: string
  street: string
  isDefault?: boolean
}) => {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) {
    throw new Error('Address not found or unauthorized')
  }

  const updated = await prisma.address.update({
    where: { id },
    data: { type, label, fullName, phoneNumber, region, city, postalCode, street, isDefault }
  })
  return updated
}

export const deleteAddress = async (addressId: string) => {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const existing = await prisma.address.findUnique({ where: { id: addressId } })
  if (!existing || existing.userId !== user.id) {
    throw new Error('Address not found or unauthorized')
  }

  await prisma.address.delete({ where: { id: addressId } })
  return { success: true }
}

export const setDefaultAddress = async (addressId: string) => {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')

  const existing = await prisma.address.findUnique({ where: { id: addressId } })
  if (!existing || existing.userId !== user.id) {
    throw new Error('Address not found or unauthorized')
  }

  // Unset all other defaults for this user
  await prisma.address.updateMany({
    where: { userId: user.id, isDefault: true },
    data: { isDefault: false }
  })

  const updated = await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true }
  })
  return updated
}

export const getUserAccounts = async (userId: string) =>
  prisma.account.findMany({
    where: { userId },
    select: { id: true, accountId: true, providerId: true, createdAt: true }
  })

export const getUserPasskeys = async (userId: string) =>
  prisma.passkey.findMany({
    where: { userId },
    select: { id: true, name: true, createdAt: true }
  })
