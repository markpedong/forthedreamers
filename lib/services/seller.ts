import 'server-only';

import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { COURIER_CODES } from '@/constants/shipping';
import { getSessionUser } from '@/lib/auth';
import { generateDefaultAvatar } from '@/lib/default-avatars';
import prisma from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const storeSchema = z.string().trim().min(2).max(100);
export const courierSelectionSchema = z
  .array(z.enum(COURIER_CODES))
  .min(1, 'Select at least one courier')
  .refine(codes => new Set(codes).size === codes.length, 'Courier selections must be unique');

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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  const authUser = data.user;
  if (error || !authUser || !authUser.identities?.length)
    throw new Error('Unable to sign up. Sign in if you already have an account.');
  const image = generateDefaultAvatar(authUser.id);
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
      await tx.seller.create({
        data: {
          storeName,
          userId: authUser.id,
        },
      });
    });
  } catch {
    throw new Error(
      'Account created, but the store could not be created. Verify your email and sign in to finish seller setup.'
    );
  }
  return { hasSession: Boolean(data.session) };
};

export const getSellerShippingSettings = async () => {
  const user = await getSessionUser();
  if (!user || user.role !== USER_ROLE.SELLER) throw new Error('Unauthorized');

  const seller = await prisma.seller.findUnique({
    where: { userId: user.id },
    select: { storeName: true, shippingMethods: { select: { code: true } } },
  });
  if (!seller) throw new Error('Seller profile not found');

  return {
    storeName: seller.storeName,
    courierCodes: seller.shippingMethods.map(method => method.code),
  };
};

export const updateSellerShippingSettings = async (courierCodes: z.infer<typeof courierSelectionSchema>) => {
  const validatedCodes = courierSelectionSchema.parse(courierCodes);
  const user = await getSessionUser();
  if (!user || user.role !== USER_ROLE.SELLER) throw new Error('Unauthorized');

  const seller = await prisma.seller.update({
    where: { userId: user.id },
    data: { shippingMethods: { set: validatedCodes.map(code => ({ code })) } },
    select: { shippingMethods: { select: { code: true } } },
  });

  return { courierCodes: seller.shippingMethods.map(method => method.code) };
};
