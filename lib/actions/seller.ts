'use server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/server-actions';
const storeSchema = z.string().trim().min(2).max(100);
export async function finishSellerSignup(storeName: string) {
  try {
    const name = storeSchema.parse(storeName);
    const session = await getSession();
    if (!session) return { success: false, message: 'Sign in to finish your seller account' };
    await prisma.$transaction(async tx => {
      await tx.seller.create({ data: { userId: session.user.id, storeName: name } });
      // Never downgrade an administrator.
      await tx.user.updateMany({ where: { id: session.user.id, role: 'USER' }, data: { role: 'SELLER' } });
    });
    return { success: true, message: 'Seller account created' };
  } catch { return { success: false, message: 'Unable to create store. The name may already be taken.' }; }
}
export async function sellerSignup(input: unknown) {
  const parsed = z.object({ storeName: storeSchema, name: z.string().trim().min(1).max(100), email: z.email(), password: z.string().min(8).max(128), confirmPassword: z.string() }).refine(v => v.password === v.confirmPassword).safeParse(input);
  if (!parsed.success) return { success: false, message: 'Check your signup details' };
  const { storeName, name, email, password } = parsed.data;
  try {
    if (await prisma.seller.findUnique({ where: { storeName }, select: { id: true } })) return { success: false, message: 'Store name is already taken' };
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error || !data.user || !data.user.identities?.length) return { success: false, message: 'Unable to sign up. Sign in if you already have an account.' };
    // Only the identity returned by auth can own the newly-created store.
    try {
      await prisma.$transaction(async tx => {
        await tx.user.upsert({ where: { id: data.user!.id }, update: {}, create: { id: data.user!.id, email, name, emailVerified: Boolean(data.user!.email_confirmed_at) } });
        await tx.seller.create({ data: { storeName, userId: data.user!.id } });
        await tx.user.updateMany({ where: { id: data.user!.id, role: 'USER' }, data: { role: 'SELLER' } });
      });
    } catch {
      return { success: false, message: 'Account created, but the store could not be created. Verify your email and sign in to finish seller setup.' };
    }
    return { success: true, message: data.session ? 'Seller account created' : 'Seller account created. Check your email to verify your account.' };
  } catch { return { success: false, message: 'Unable to sign up. Please try again.' }; }
}
