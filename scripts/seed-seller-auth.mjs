import { createClient } from '@supabase/supabase-js';

const EMAIL = 'seller@dreamers.com';
const PASSWORD = process.env.SEED_PASSWORD ?? 'M@rk0418';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) throw new Error('Missing Supabase admin env vars.');

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Email may already exist in Supabase (e.g. from signup) — reset the password instead of failing.
const { data: list, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (listError) throw new Error(listError.message);
const existing = list.users.find(u => u.email?.toLowerCase() === EMAIL);

const { data, error } = existing
  ? await supabase.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { username: 'dreamer_store', displayName: 'Dreamer Store' },
    })
  : await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { username: 'dreamer_store', displayName: 'Dreamer Store' },
    });
if (error) throw new Error(error.message);
console.log(existing ? 'updated existing auth user' : 'created auth user');

// Supabase issues its own uuid — the seed's 'test-seller-001' points at a different id,
// so remap user/seller/product ownership onto the real auth id.
const authId = data.user.id;
const { PrismaClient } = await import('../generated/prisma/client.js');
const { PrismaPg } = await import('@prisma/adapter-pg');
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }),
});

// The DB seed (seed-products.ts) owns the store + products under a placeholder id.
// Re-point that placeholder row at the real Supabase auth id so the login works,
// and move the seller owner with it. Username/displayName stay with the store.
const PLACEHOLDER_ID = 'test-seller-001';

const placeholder = await prisma.user.findUnique({ where: { id: PLACEHOLDER_ID }, select: { id: true } });

if (placeholder && placeholder.id !== authId) {
  await prisma.$transaction(async tx => {
    // Re-key the placeholder row in place. Creating a second user would trip user_email_key
    // (the same email may already belong to another row), and seller.userId is an FK to user.id,
    // so the row has to be re-pointed rather than duplicated. Products hang off seller, not user.
    await tx.user.update({
      where: { id: PLACEHOLDER_ID },
      data: { id: authId, email: EMAIL, role: 'SELLER', emailVerified: true },
    });
  });
} else {
  await prisma.user.upsert({
    where: { id: authId },
    update: { email: EMAIL, role: 'SELLER', emailVerified: true },
    create: {
      id: authId,
      email: EMAIL,
      username: 'dreamer_store',
      displayName: 'Dreamer Store',
      role: 'SELLER',
      emailVerified: true,
    },
  });
}

const store = await prisma.seller.findUniqueOrThrow({
  where: { userId: authId },
  select: { id: true, storeName: true, _count: { select: { products: true } } },
});
console.log(
  `linked ${EMAIL} -> seller "${store.storeName}" (${store.id}), ${store._count.products} products`
);

const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({
  email: EMAIL,
  password: PASSWORD,
});
if (signInError) throw new Error(`sign-in check failed: ${signInError.message}`);
if (signIn.user.id !== authId) throw new Error('sign-in returned a different user id');
console.log('sign-in check: ok, userId =', signIn.user.id);
await prisma.$disconnect();
