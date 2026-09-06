import 'server-only';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/server-actions';
import { regenerateSlug } from '@/utils/helper';
import { invalidateCatalog } from '@/lib/cache';
import { revalidatePath } from 'next/cache';

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') throw new Error('Administrator access required');
  return session.user;
}

const idSchema = z.string().min(1).max(100);

const variantSchema = z.object({
  id: idSchema.optional(), name: z.string().min(1).max(200), price: z.number().finite().nonnegative(),
  discountedPrice: z.number().finite().nonnegative().nullable().optional(), stock: z.number().int().nonnegative(),
  image: z.string().nullable().optional(), coupon: z.string().nullable().optional(), attributes: z.record(z.string(), z.string()),
}).refine(v => v.discountedPrice == null || v.discountedPrice <= v.price, 'Invalid discount');

const productSchema = z.object({
  id: idSchema.optional(), name: z.string().trim().min(1).max(200), categoryId: idSchema,
  brand: z.string().nullable().optional(), basePrice: z.number().finite().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().nullable().optional(), description: z.string().max(20000),
  images: z.array(z.string()).max(20), tags: z.array(z.string()).max(100), status: z.enum(['ACTIVE', 'INACTIVE']),
  specs: z.array(z.object({ id: idSchema.optional(), label: z.string().min(1), value: z.string() })).max(100),
  variants: z.array(variantSchema).max(100),
});

export async function adminProducts() {
  await requireAdmin();
  const products = await prisma.product.findMany({ include: { category: true, variants: true, specs: true, seller: true }, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }], take: 100 });
  return products.map(p => ({ ...p, variants: p.variants.map(v => ({ ...v, attributes: z.record(z.string(), z.string()).catch({}).parse(v.attributes) })) }));
}

export async function adminCategories() { await requireAdmin(); return prisma.category.findMany({ orderBy: { name: 'asc' } }); }

const invalidate = async () => {
  await invalidateCatalog()
  revalidatePath('/')
  revalidatePath('/products/[slug]', 'page')
  revalidatePath('/products')
  revalidatePath('/categories')
}

export async function saveProduct(input: unknown, editing: boolean) {
  const user = await requireAdmin();
  const { id, categoryId, variants, specs, ...fields } = productSchema.parse(input);
  const result = await prisma.$transaction(async tx => {
    if (!await tx.category.findUnique({ where: { id: categoryId }, select: { id: true } })) throw new Error('Category not found');
    if (!editing) {
      const seller = await tx.seller.findUnique({ where: { userId: user.id }, select: { id: true } });
      if (!seller) throw new Error('A seller profile is required');
      return tx.product.create({ data: { ...fields, slug: regenerateSlug(fields.name), categoryId, sellerId: seller.id,
        variants: { create: variants.map(v => { const variant = {...v}; delete variant.id; return variant }) }, specs: { create: specs.map(s => { const spec = {...s}; delete spec.id; return spec }) } } });
    }
    if (!id) throw new Error('Product ID required');
    const existing = await tx.product.findUnique({ where: { id }, select: { variants: { select: { id: true } }, specs: { select: { id: true } } } });
    if (!existing) throw new Error('Product not found');
    for (const v of variants) if (v.id && !existing.variants.some(e => e.id === v.id)) throw new Error('Invalid variant');
    for (const s of specs) if (s.id && !existing.specs.some(e => e.id === s.id)) throw new Error('Invalid specification');
    await tx.variant.deleteMany({ where: { productId: id, id: { notIn: variants.flatMap(v => v.id ? [v.id] : []) } } });
    await tx.spec.deleteMany({ where: { productId: id, id: { notIn: specs.flatMap(s => s.id ? [s.id] : []) } } });
    for (const { id: variantId, ...v } of variants) {
      if (variantId) await tx.variant.update({ where: { id: variantId, productId: id }, data: v });
      else await tx.variant.create({ data: { ...v, productId: id } });
    }
    for (const { id: specId, ...s } of specs) {
      if (specId) await tx.spec.update({ where: { id: specId, productId: id }, data: s });
      else await tx.spec.create({ data: { ...s, productId: id } });
    }
    return tx.product.update({ where: { id }, data: { ...fields, categoryId, slug: regenerateSlug(fields.name) } });
  });
  await invalidate(); return result;
}

export async function deleteProduct(id: string) { await requireAdmin(); await prisma.product.delete({ where: { id: idSchema.parse(id) } }); await invalidate(); }

export async function setProductStatus(id: string, active: boolean) {
  await requireAdmin(); z.boolean().parse(active);
  const product = await prisma.product.update({ where: { id: idSchema.parse(id) }, data: { status: active ? 'ACTIVE' : 'INACTIVE' } });
  await invalidate(); return product;
}

export async function saveCategory(name: string, id?: string) {
  await requireAdmin(); const data = { name: z.string().trim().min(1).max(100).parse(name) };
  const result = id ? await prisma.category.update({ where: { id: idSchema.parse(id) }, data }) : await prisma.category.create({ data });
  await invalidate(); return result;
}
