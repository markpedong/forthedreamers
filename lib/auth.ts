import { cache } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "./prisma";
import { createSupabaseServerClient } from "./supabase/server";

export const upsertAuthUser = async (user: SupabaseUser) => {
  if (!user.email) return null;

  const profile = await prisma.user.findUnique({ where: { id: user.id } });
  const name =
    profile?.name ||
    (typeof user.user_metadata.name === "string" && user.user_metadata.name) ||
    (typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name) ||
    user.email.split("@")[0] ||
    "user";
  const image = typeof user.user_metadata.avatar_url === "string" ? user.user_metadata.avatar_url : null;
  const emailVerified = Boolean(user.email_confirmed_at);

  if (!profile) {
    return prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name,
        image,
        emailVerified,
      },
    });
  }

  if (
    profile.email !== user.email ||
    profile.emailVerified !== emailVerified ||
    profile.image !== image
  ) {
    return prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        image,
        emailVerified,
      },
    });
  }

  return profile;
};

export const getCurrentUserID = cache(async (): Promise<string | undefined> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
});

export const getSessionUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return upsertAuthUser(user);
});
