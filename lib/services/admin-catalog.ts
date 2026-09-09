import 'server-only';

import { z } from 'zod';
import { Prisma, USER_ROLE } from '@/generated/prisma';
import { invalidateCatalog } from '@/lib/cache';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/services/auth';
import type { TProduct } from '@/lib/types';
import { regenerateSlug } from '@/utils/helper';
import { revalidatePath } from 'next/cache';

export const requireCatalogAccess = async () => {
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

const productInclude = {
  category: true,
  variants: true,
  specs: true,
  seller: true,
} satisfies Prisma.ProductInclude;

const normalizeProduct = (product: Prisma.ProductGetPayload<{ include: typeof productInclude }>): TProduct => ({
  ...product,
  images: product.images.filter(image => !image.startsWith('blob:')),
  variants: product.variants.map(variant => ({
    ...variant,
    attributes: z.record(z.string(), z.string()).catch({}).parse(variant.attributes),
  })),
});

const variantSchema = z
  .object({
    id: idSchema.optional(),
    name: z.string().min(1).max(200),
    price: z.number().finite().nonnegative(),
    discountedPrice: z.number().finite().nonnegative().nullable().optional(),
    stock: z.number().int().nonnegative(),
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
    include: productInclude,
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    take: 100,
  });

  return products.map(normalizeProduct);
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
  const slug = regenerateSlug(fields.name);
  let result: Prisma.ProductGetPayload<{ include: typeof productInclude }>;

  if (!editing) {
    const seller = await prisma.seller.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!seller) throw new Error('A seller profile is required');

    result = await prisma.product.create({
      data: {
        ...fields,
        slug,
        categoryId,
        sellerId: seller.id,
        variants: {
          create: variants.map(variant => {
            const data = { ...variant };
            delete data.id;
            return data;
          }),
        },
        specs: {
          create: specs.map(spec => {
            const data = { ...spec };
            delete data.id;
            return data;
          }),
        },
      },
      include: productInclude,
    });
  } else {
    if (!id) throw new Error('Product ID required');

    const existing = await prisma.product.findFirst({
      where: { id, ...(user.role === USER_ROLE.SELLER && { seller: { userId: user.id } }) },
      select: { variants: { select: { id: true } }, specs: { select: { id: true } } },
    });
    if (!existing) throw new Error('Product not found');

    const variantIds = new Set(existing.variants.map(variant => variant.id));
    const specIds = new Set(existing.specs.map(spec => spec.id));
    if (variants.some(variant => variant.id && !variantIds.has(variant.id))) throw new Error('Invalid variant');
    if (specs.some(spec => spec.id && !specIds.has(spec.id))) throw new Error('Invalid specification');

    result = await prisma.product.update({
      where: { id },
      data: {
        ...fields,
        categoryId,
        slug,
        variants: {
          deleteMany: { id: { notIn: variants.flatMap(variant => (variant.id ? [variant.id] : [])) } },
          update: variants.flatMap(({ id: variantId, ...variant }) =>
            variantId ? [{ where: { id: variantId }, data: variant }] : []
          ),
          create: variants.flatMap(({ id: variantId, ...variant }) => (variantId ? [] : [variant])),
        },
        specs: {
          deleteMany: { id: { notIn: specs.flatMap(spec => (spec.id ? [spec.id] : [])) } },
          update: specs.flatMap(({ id: specId, ...spec }) => (specId ? [{ where: { id: specId }, data: spec }] : [])),
          create: specs.flatMap(({ id: specId, ...spec }) => (specId ? [] : [spec])),
        },
      },
      include: productInclude,
    });
  }

  await invalidate();
  return normalizeProduct(result);
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
