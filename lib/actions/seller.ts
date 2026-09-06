'use server'

import { z } from 'zod'
import { USER_ROLE } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/server-actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const storeSchema = z.string().trim().min(2).max(100)

export const finishSellerSignup = async (storeName: string) => {
  try {
    const name = storeSchema.parse(storeName)
    const session = await getSession()
    if (!session) return { success: false, message: 'Sign in to finish your seller account' }

    await prisma.$transaction(async tx => {
      const user = await tx.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
      if (!user) throw new Error('User account not found')

      await tx.seller.create({ data: { userId: session.user.id, storeName: name } })

      if (user.role !== USER_ROLE.ADMIN) {
        await tx.user.update({ where: { id: session.user.id }, data: { role: USER_ROLE.SELLER } })
      }
    })

    return { success: true, message: 'Seller account created' }
  } catch {
    return { success: false, message: 'Unable to create store. The name may already be taken.' }
  }
}

export const sellerSignup = async (input: unknown) => {
  const parsed = z
    .object({
      storeName: storeSchema,
      name: z.string().trim().min(1).max(100),
      email: z.email(),
      password: z.string().min(8).max(128),
      confirmPassword: z.string()
    })
    .refine(value => value.password === value.confirmPassword)
    .safeParse(input)

  if (!parsed.success) return { success: false, message: 'Check your signup details' }

  const { storeName, name, email, password } = parsed.data

  try {
    if (await prisma.seller.findUnique({ where: { storeName }, select: { id: true } })) {
      return { success: false, message: 'Store name is already taken' }
    }

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    const authUser = data.user

    if (error || !authUser || !authUser.identities?.length) {
      return { success: false, message: 'Unable to sign up. Sign in if you already have an account.' }
    }

    try {
      await prisma.$transaction(async tx => {
        await tx.user.upsert({
          where: { id: authUser.id },
          update: { email, name, role: USER_ROLE.SELLER },
          create: {
            id: authUser.id,
            email,
            name,
            emailVerified: Boolean(authUser.email_confirmed_at),
            role: USER_ROLE.SELLER
          }
        })
        await tx.seller.create({ data: { storeName, userId: authUser.id } })
      })
    } catch {
      return { success: false, message: 'Account created, but the store could not be created. Verify your email and sign in to finish seller setup.' }
    }

    return { success: true, message: data.session ? 'Seller account created' : 'Seller account created. Check your email to verify your account.' }
  } catch {
    return { success: false, message: 'Unable to sign up. Please try again.' }
  }
}
