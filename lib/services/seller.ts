import 'server-only';

import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { getRandomDefaultAvatarUrl } from '@/lib/default-avatars';
import prisma from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const storeSchema = z.string().trim().min(2).max(100);
export const sellerSignupSchema = z
  .object({
    storeName: storeSchema,
    name: z.string().trim().min(1).max(100),
    email: z.email(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string(),
  })
  .refine(value => value.password === value.confirmPassword);

export const sellerSignup = async ({ storeName, name, email, password }: z.infer<typeof sellerSignupSchema>) => {
  if (await prisma.seller.findUnique({ where: { storeName }, select: { id: true } }))
    throw new Error('Store name is already taken');
  const supabase = await createSupabaseServerClient();
  const image = getRandomDefaultAvatarUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, avatar_url: image } },
  });
  const authUser = data.user;
  if (error || !authUser || !authUser.identities?.length)
    throw new Error('Unable to sign up. Sign in if you already have an account.');
  try {
    await prisma.$transaction(async tx => {
      await tx.user.upsert({
        where: { id: authUser.id },
        update: { email, name, image, role: USER_ROLE.SELLER },
        create: {
          id: authUser.id,
          email,
          name,
          image,
          emailVerified: Boolean(authUser.email_confirmed_at),
          role: USER_ROLE.SELLER,
        },
      });
      await tx.seller.create({ data: { storeName, userId: authUser.id } });
    });
  } catch {
    throw new Error(
      'Account created, but the store could not be created. Verify your email and sign in to finish seller setup.'
    );
  }
  return { hasSession: Boolean(data.session) };
};
