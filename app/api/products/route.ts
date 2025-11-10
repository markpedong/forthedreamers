import prisma from "@/lib/prisma";
import { successResponse, errorResponse, getPaginatedData, buildServerQuery } from "@/lib/server-helper";
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
        variants: {
          omit: { createdAt: true, updatedAt: true, productId: true },
          include: {
            options: {
              omit: { createdAt: true, updatedAt: true, variantId: true },
            },
          },
        },
      },
    });

    return successResponse(res);
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, categoryId, specs = [], variants = [], ...rest } = body;
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
        basePrice: rest.basePrice,
        description: rest.description,
        images: rest.images || [],
        tags: rest.tags || [],
        stock: rest.stock,
        status: rest.status,
        category: { connect: { id: categoryId } },
        seller: { connect: { id: seller.id } },
        specs: {
          create: specs.map((s: any) => ({ label: s.label, value: s.value })),
        },
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            isRequired: v.isRequired ?? true,
            options: {
              create: (v.options || []).map((o: any) => ({
                variantOptionName: o.variantOptionName,
                price: o.price,
                discountedPrice: o.discountedPrice ?? null,
                stock: o.stock,
                coupon: o.coupon ?? null,
              })),
            },
          })),
        },
      },
      include: {
        specs: { omit: { createdAt: true, updatedAt: true, productId: true } },
        category: true,
        variants: {
          omit: { createdAt: true, updatedAt: true, productId: true },
          include: { options: { omit: { createdAt: true, updatedAt: true, variantId: true } } },
        },
      },
    });

    return successResponse(product, "Product created successfully", 201);
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, categoryId, specs = [], variants = [], ...rest } = body;
    if (!id) return errorResponse("Product ID is required");
    if (!name || !categoryId) return errorResponse("Name and categoryId are required");

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return errorResponse("Product not found");

    const product = await prisma.$transaction(async (tx) => {
      await tx.spec.deleteMany({ where: { productId: id } });
      await tx.variantOption.deleteMany({ where: { variantId: { in: (await tx.variant.findMany({ where: { productId: id }, select: { id: true } })).map(v => v.id) } } });
      await tx.variant.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id },
        data: {
          name,
          slug: regenerateSlug(name),
          brand: rest.brand,
          basePrice: Number(rest.basePrice),
          description: rest.description,
          images: rest.images || [],
          tags: rest.tags || [],
          stock: Number(rest.stock),
          status: rest.status,
          category: { connect: { id: categoryId } },
          specs: {
            create: specs.map((s: any) => ({ label: s.label, value: s.value })),
          },
          variants: {
            create: variants.map((v: any) => ({
              name: v.name,
              isRequired: v.isRequired ?? true,
              options: {
                create: (v.options || []).map((o: any) => ({
                  variantOptionName: o.variantOptionName,
                  price: o.price,
                  discountedPrice: o.discountedPrice ?? null,
                  stock: o.stock,
                  coupon: o.coupon ?? null,
                })),
              },
            })),
          },
        },
        include: {
          specs: { omit: { createdAt: true, updatedAt: true, productId: true } },
          category: true,
          variants: {
            omit: { createdAt: true, updatedAt: true, productId: true },
            include: { options: { omit: { createdAt: true, updatedAt: true, variantId: true } } },
          },
        },
      });

    });

    return successResponse(product, "Product updated successfully");
  } catch (err: unknown) {
    return errorResponse(err);
  }
}