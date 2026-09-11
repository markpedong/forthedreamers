import 'server-only';

import prisma from '@/lib/prisma';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const listUsers = async () => {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(error.message);
  const profiles = await prisma.user.findMany({
    where: { id: { in: data.users.map(user => user.id) } },
    select: { id: true, username: true, displayName: true, emailVerified: true, role: true, banned: true },
  });
  const profileById = new Map(profiles.map(profile => [profile.id, profile]));
  return data.users.map(user => {
    const profile = profileById.get(user.id);
    return {
      ...user,
      username: profile?.username ?? '',
      displayName: profile?.displayName ?? profile?.username ?? '',
      email: user.email ?? '',
      emailVerified: profile?.emailVerified ?? Boolean(user.email_confirmed_at),
      role: profile?.role ?? 'USER',
      banned: profile?.banned ?? false,
    };
  });
};

export const setUserBanned = (userId: string, banned: boolean) =>
  prisma.user.update({ where: { id: userId }, data: { banned } });

export const deleteUser = async (userId: string) => {
  const { error } = await createSupabaseAdminClient().auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  await prisma.user.delete({ where: { id: userId } });
};
