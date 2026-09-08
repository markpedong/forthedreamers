import 'server-only';

import { z } from 'zod';
import { USER_ROLE } from '@/generated/prisma';
import { invalidateCatalog } from '@/lib/cache';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/services/auth';
import { regenerateSlug } from '@/utils/helper';
import { revalidatePath } from 'next/cache';

const requireCatalogAccess = async () => {
  const session = await getSession();
  if (!session || (session.user.role !== USER_ROLE.ADMIN && session.user.role !== USER_ROLE.SELLER)) {
    throw new Error('Catalog access required');
  }
  return session.user;
};

export const requireAdmin = async () => {
  const session = await getSession();
  if (!session || session.user.role !== USER_ROLE.ADMIN) throw new Error('Administrator access required');
  return session.user;
};

const idSchema = z.string().min(1).max(100);

const variantSchema = z
  .object({
    id: idSchema.optional(),
    name: z.string().min(1).max(200),
    price: z.number().finite().nonnegative(),
    discountedPrice: z.number().finite().nonnegative().nullable().optional(),
    stock: z.number().int().nonnegative(),
    image: z.string().nullable().optional(),
    coupon: z.string().nullable().optional(),
    attributes: z.record(z.string(), z.string()),
  })
  .refine(value => value.discountedPrice == null || value.discountedPrice <= value.price, 'Invalid discount');

export const productSchema = z.object({
  id: idSchema.optional(),
  name: z.string().trim().min(1).max(200),
  categoryId: idSchema,
  brand: z.string().nullable().optional(),
  basePrice: z.number().finite().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().nullable().optional(),
  description: z.string().max(20000),
  images: z.array(z.string()).max(20),
  tags: z.array(z.string()).max(100),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  specs: z.array(z.object({ id: idSchema.optional(), label: z.string().min(1), value: z.string() })).max(100),
  variants: z.array(variantSchema).max(100),
});

const requireProductAccess = async (id: string) => {
  const user = await requireCatalogAccess();
  if (user.role === USER_ROLE.ADMIN) return user;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { seller: { select: { userId: true } } },
  });

  if (product?.seller.userId !== user.id) throw new Error('Product not found');
  return user;
};

export const adminProducts = async () => {
  const user = await requireCatalogAccess();
  const products = await prisma.product.findMany({
    where: user.role === USER_ROLE.SELLER ? { seller: { userId: user.id } } : undefined,
    include: { category: true, variants: true, specs: true, seller: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    take: 100,
  });

  return products.map(product => ({
    ...product,
    variants: product.variants.map(variant => ({
      ...variant,
      attributes: z.record(z.string(), z.string()).catch({}).parse(variant.attributes),
    })),
  }));
};

export const adminCategories = async () => {
  await requireCatalogAccess();
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

const invalidate = async () => {
  await invalidateCatalog();
  revalidatePath('/');
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/products');
  revalidatePath('/categories');
};

export const saveProduct = async (input: unknown, editing: boolean) => {
  const user = await requireCatalogAccess();
  const { id, categoryId, variants, specs, ...fields } = productSchema.parse(input);
  const result = await prisma.$transaction(async tx => {
    const seller = await tx.seller.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!(await tx.category.findUnique({ where: { id: categoryId }, select: { id: true } })))
      throw new Error('Category not found');

    if (!editing) {
      if (!seller) throw new Error('A seller profile is required');

      return tx.product.create({
        data: {
          ...fields,
          slug: regenerateSlug(fields.name),
          categoryId,
          sellerId: seller.id,
          variants: {
            create: variants.map(variant => {
              const value = { ...variant };
              delete value.id;
              return value;
            }),
          },
          specs: {
            create: specs.map(spec => {
              const value = { ...spec };
              delete value.id;
              return value;
            }),
          },
        },
      });
    }

    if (!id) throw new Error('Product ID required');

    const existing = await tx.product.findUnique({
      where: { id },
      select: { sellerId: true, variants: { select: { id: true } }, specs: { select: { id: true } } },
    });
    if (!existing) throw new Error('Product not found');
    if (user.role === USER_ROLE.SELLER && existing.sellerId !== seller?.id) throw new Error('Product not found');

    for (const variant of variants) {
      if (variant.id && !existing.variants.some(existingVariant => existingVariant.id === variant.id)) {
        throw new Error('Invalid variant');
      }
    }

    for (const spec of specs) {
      if (spec.id && !existing.specs.some(existingSpec => existingSpec.id === spec.id)) {
        throw new Error('Invalid specification');
      }
    }

    await tx.variant.deleteMany({
      where: { productId: id, id: { notIn: variants.flatMap(variant => (variant.id ? [variant.id] : [])) } },
    });
    await tx.spec.deleteMany({
      where: { productId: id, id: { notIn: specs.flatMap(spec => (spec.id ? [spec.id] : [])) } },
    });

    for (const { id: variantId, ...variant } of variants) {
      if (variantId) await tx.variant.update({ where: { id: variantId, productId: id }, data: variant });
      else await tx.variant.create({ data: { ...variant, productId: id } });
    }

    for (const { id: specId, ...spec } of specs) {
      if (specId) await tx.spec.update({ where: { id: specId, productId: id }, data: spec });
      else await tx.spec.create({ data: { ...spec, productId: id } });
    }

    return tx.product.update({ where: { id }, data: { ...fields, categoryId, slug: regenerateSlug(fields.name) } });
  });

  await invalidate();
  return result;
};

export const deleteProduct = async (id: string) => {
  await requireProductAccess(idSchema.parse(id));
  await prisma.product.delete({ where: { id: idSchema.parse(id) } });
  await invalidate();
};

export const setProductStatus = async (id: string, active: boolean) => {
  await requireProductAccess(idSchema.parse(id));
  z.boolean().parse(active);
  const product = await prisma.product.update({
    where: { id: idSchema.parse(id) },
    data: { status: active ? 'ACTIVE' : 'INACTIVE' },
  });
  await invalidate();
  return product;
};

export const saveCategory = async (name: string, id?: string) => {
  await requireAdmin();
  const data = { name: z.string().trim().min(1).max(100).parse(name) };
  const result = id
    ? await prisma.category.update({ where: { id: idSchema.parse(id) }, data })
    : await prisma.category.create({ data });
  await invalidate();
  return result;
};
