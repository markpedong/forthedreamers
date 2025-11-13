import prisma from "@/lib/prisma";
import { successResponse, errorResponse, getPaginatedData, buildServerQuery } from "@/lib/server-helper";
import { ProductFormData } from "@/lib/types";
import { regenerateSlug } from "@/utils/helper";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const where = buildServerQuery(url);

    const res = await getPaginatedData({
      model: "product",
      where,
      include: {
        specs: {
          omit: { createdAt: true, updatedAt: true, productId: true },
        },
        category: { omit: { createdAt: true, updatedAt: true } },
        variants: {
          omit: { createdAt: true, updatedAt: true, productId: true },
        },
      },
      omit: {
        sellerId: true,
        categoryId: true
      }
    });

    return successResponse(res);
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, categoryId, specs = [], variants = [], ...rest } = body as ProductFormData & { sellerId?: string };
    if (!name || !categoryId) return errorResponse("Name and categoryId are required");

    const seller = await prisma.seller.findUnique({
      where: { userId: rest.sellerId },
      select: { id: true },
    });
    if (!seller) return errorResponse("Seller not found");

    const product = await prisma.product.create({
      data: {
        name,
        slug: regenerateSlug(name),
        brand: rest.brand,
        basePrice: Number(rest.basePrice),
        description: String(rest.description),
        images: rest.images || [],
        tags: rest.tags || [],
        stock: Number(rest.stock),
        status: rest.status,
        category: { connect: { id: categoryId } },
        seller: { connect: { id: seller.id } },
        specs: { create: specs },
        variants: { create: variants },
      },
      include: {
        specs: { omit: { createdAt: true, updatedAt: true, productId: true } },
        category: true,
      },
    });

    return successResponse({ data: product }, "Product created successfully", 201);
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, categoryId, specs = [], variants = [], ...rest } = body as ProductFormData & {
      sellerId?: string;
    };

    if (!id) return errorResponse("Product ID is required");
    if (!name || !categoryId) return errorResponse("Name and categoryId are required");

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { specs: true, variants: true },
    });
    if (!existingProduct) return errorResponse("Product not found");

    const existingSpecs = existingProduct.specs;
    const existingVariants = existingProduct.variants;

    const txResult = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          slug: regenerateSlug(name),
          brand: rest.brand,
          basePrice: Number(rest.basePrice),
          description: String(rest.description),
          images: rest.images || [],
          tags: rest.tags || [],
          stock: Number(rest.stock),
          status: rest.status,
          category: { connect: { id: categoryId } },
        },
      });

      const newSpecs = specs.filter((s) => !existingSpecs.some((es) => es.id === s.id));
      const deletedSpecs = existingSpecs.filter((es) => !specs.some((s) => s.id === es.id));
      const updatedSpecs = specs.filter((s) =>
        existingSpecs.some(
          (es) => es.id === s.id && (es.label !== s.label || es.value !== s.value)
        )
      );

      const newVariants = variants.filter((v) => !existingVariants.some((ev) => ev.id === v.id)); // some returns boolean that's existing in the db variants, then filtering it via boolean
      const deletedVariants = existingVariants.filter((ev) => !variants.some((v) => v.id === ev.id)); // some returns boolean that's existing in the db variants, then filtering it via boolean
      const updatedVariants = variants.filter((v) =>
        existingVariants.some(
          (ev) =>
            ev.id === v.id &&
            (ev.name !== v.name ||
              ev.price !== v.price ||
              ev.discountedPrice !== v.discountedPrice ||
              ev.coupon !== v.coupon ||
              ev.stock !== v.stock ||
              JSON.stringify(ev.attributes) !== JSON.stringify(v.attributes))
        )
      );

      await Promise.all([
        ...newSpecs.map((s) =>
          tx.spec.create({ data: { ...s, productId: id } })
        ),
        ...updatedSpecs.map((s) =>
          tx.spec.update({ where: { id: s.id }, data: { label: s.label, value: s.value } })
        ),
        ...deletedSpecs.map((s) => tx.spec.delete({ where: { id: s.id } })),

        ...newVariants.map((v) =>
          tx.variant.create({ data: { ...v, productId: id } })
        ),
        ...updatedVariants.map((v) =>
          tx.variant.update({
            where: { id: v.id },
            data: {
              name: v.name,
              price: v.price,
              discountedPrice: v.discountedPrice ?? null,
              coupon: v.coupon ?? null,
              stock: v.stock,
              image: v.image,
              attributes: v.attributes,
            },
          })
        ),
        ...deletedVariants.map((v) => tx.variant.delete({ where: { id: v.id } })),
      ]);

      return product;
    });

    return successResponse(txResult);
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to update product");
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return errorResponse("Product ID is required");

    await prisma.product.delete({ where: { id } });
    return successResponse(null, "Product deleted successfully");
  } catch (err: unknown) {
    return errorResponse(err);
  }
}