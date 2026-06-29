import { cache } from "react";
import { prisma } from "./prisma";
import { createSupabaseServerClient } from "./supabase/server";

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

  const profile = await prisma.user.findUnique({ where: { id: user.id } });
  const name =
    profile?.name ||
    (typeof user.user_metadata.name === "string" && user.user_metadata.name) ||
    (typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name) ||
    user.email?.split("@")[0] ||
    "user";

  if (!profile && user.email) {
    return prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name,
        emailVerified: Boolean(user.email_confirmed_at),
        image: typeof user.user_metadata.avatar_url === "string" ? user.user_metadata.avatar_url : null,
      },
    });
  }

  return profile;
});
