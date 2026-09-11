import { cache } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { generateDefaultAvatar } from './default-avatars';
import { generateDisplayName, generateUsername, slugifyUsername } from './display-name';
import { prisma } from './prisma';
import { createSupabaseServerClient } from './supabase/server';

/** Google hands us a real name but no username — never derive the handle from it. */
const usernameFromMetadata = (user: SupabaseUser) => {
  const handle = typeof user.user_metadata.username === 'string' ? user.user_metadata.username : '';
  return /^[a-z0-9_]{3,24}$/.test(handle) ? handle : null;
};

export const upsertAuthUser = async (user: SupabaseUser) => {
  if (!user.email) return null;

  const profile = await prisma.user.findUnique({ where: { id: user.id } });
  const metadataImage = typeof user.user_metadata.avatar_url === 'string' ? user.user_metadata.avatar_url : null;
  const emailVerified = Boolean(user.email_confirmed_at);

  if (!profile) {
    const image = metadataImage ?? generateDefaultAvatar(user.id);
    const username =
      usernameFromMetadata(user) ?? (await uniqueUsername(slugifyUsername(user.email.split('@')[0])));

    // A generated avatar has to be mirrored into Auth so OAuth callbacks and other devices agree on it.
    if (!metadataImage) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.updateUser({ data: { avatar_url: image, username } });
      if (error) console.error('Unable to persist default avatar in Supabase Auth:', error.message);
    }

    return prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        username,
        displayName: generateDisplayName(),
        image,
        emailVerified,
      },
    });
  }

  const image = metadataImage ?? profile.image ?? generateDefaultAvatar(user.id);

  if (profile.email !== user.email || profile.emailVerified !== emailVerified || profile.image !== image) {
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

/** Appends `_2`, `_3`, ... until the handle is free. Uniqueness is enforced by the DB constraint; this only avoids the round-trip error. */
export const uniqueUsername = async (base: string) => {
  for (let attempt = 1; attempt < 25; attempt++) {
    const candidate = attempt === 1 ? base : `${base}_${attempt}`;
    const taken = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } });
    if (!taken) return candidate;
  }
  return generateUsername();
};

export const getSessionClaims = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  return error ? null : data?.claims ?? null;
});

export const getCurrentUserID = cache(async (): Promise<string | undefined> => {
  const claims = await getSessionClaims();
  return claims?.sub;
});

export const getSessionUser = cache(async () => {
  const userId = await getCurrentUserID();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      image: true,
      emailVerified: true,
      role: true,
      twoFactorEnabled: true,
      banned: true,
      createdAt: true,
      updatedAt: true,
    },
  });
});
