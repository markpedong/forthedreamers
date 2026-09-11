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
      user_metadata: { name: 'Dreamer Store' },
    })
  : await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: 'Dreamer Store' },
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

// Link seller@dreamers.com onto the seller's own existing store (never delete the other account:
// the seller row and its products cascade with it).
const existingSeller = await prisma.seller.findFirst({
  where: { NOT: { userId: authId } },
  select: { id: true, storeName: true },
});

const owner = await prisma.user.upsert({
  where: { id: authId },
  update: { email: EMAIL, role: 'SELLER', emailVerified: true },
  create: {
    id: authId,
    email: EMAIL,
    name: 'Dreamer Store',
    role: 'SELLER',
    emailVerified: true,
  },
});

const store = existingSeller
  ? await prisma.seller.update({
      where: { id: existingSeller.id },
      data: { userId: owner.id },
      select: { id: true, storeName: true },
    })
  : await prisma.seller.create({
      data: {
        userId: owner.id,
        storeName: "Dreamer's Shop",
        contact: '+1-555-0123',
        rating: 4.5,
        reviewCount: 128,
        totalSales: 1542.5,
        description: 'Premium quality products for dreamers and creators.',
        address: '123 Dream Street, Creative City',
        logo: 'https://placehold.co/200x200/4F46E5/FFFFFF?text=DS',
        banner: 'https://placehold.co/1200x400/7C3AED/FFFFFF?text=Dreamer%27s+Shop',
      },
      select: { id: true, storeName: true },
    });
console.log(`linked ${EMAIL} -> seller "${store.storeName}" (${store.id})`);

const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({
  email: EMAIL,
  password: PASSWORD,
});
if (signInError) throw new Error(`sign-in check failed: ${signInError.message}`);
if (signIn.user.id !== owner.id) throw new Error('sign-in returned a different user id');
console.log('sign-in check: ok, userId =', signIn.user.id);
await prisma.$disconnect();
