import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { regenerateSlug } from "@/utils/helper";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        specs: {
          omit: {
            createdAt: true,
            updatedAt: true,
            productId: true,
          },
        },
        category: true,
        variants: {
          omit: {
            createdAt: true,
            updatedAt: true,
            productId: true,
          },
          include: {
            options: {
              omit: {
                createdAt: true,
                updatedAt: true,
                variantId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(products);
  } catch (err: unknown) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      brand,
      basePrice,
      description,
      images,
      tags,
      stock,
      status,
      sellerId,
      categoryId,
      specs = [],
      variants = [],
    } = body;

    if (!name || !categoryId)
      return errorResponse("Name and categoryId are required");

    const seller = await prisma.seller.findUnique({
      where: { userId: sellerId },
      select: { id: true },
    });

    if (!seller)
      return errorResponse("Seller not found for the given userId");

    const product = await prisma.product.create({
      data: {
        name,
        slug: regenerateSlug(name),
        brand,
        basePrice,
        description,
        images: images || [],
        tags: tags || [],
        stock,
        status,
        sellerId: seller.id,
        categoryId,
        specs: {
          create: specs.map((s: any) => ({
            label: s.label,
            value: s.value,
          })),
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
        specs: {
          omit: {
            createdAt: true,
            updatedAt: true,
            productId: true,
          },
        },
        category: true,
        variants: {
          omit: {
            createdAt: true,
            updatedAt: true,
            productId: true,
          },
          include: {
            options: {
              omit: {
                createdAt: true,
                updatedAt: true,
                variantId: true,
              },
            },
          },
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
    const {
      id,
      name,
      brand,
      basePrice,
      description,
      images,
      tags,
      stock,
      status,
      categoryId,
      specs = [],
      variants = [],
    } = body;

    if (!id) return errorResponse("Product ID is required");
    if (!name || !categoryId)
      return errorResponse("Name and categoryId are required");

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return errorResponse("Product not found");

    const product = await prisma.$transaction(async (tx) => {
      const existingVariants = await tx.variant.findMany({
        where: { productId: id },
        select: { id: true },
      });

      const variantIds = existingVariants.map((v) => v.id);

      await tx.spec.deleteMany({ where: { productId: id } });
      if (variantIds.length)
        await tx.variantOption.deleteMany({
          where: { variantId: { in: variantIds } },
        });
      await tx.variant.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id },
        data: {
          name,
          slug: regenerateSlug(name),
          brand,
          basePrice,
          description,
          images: images || [],
          tags: tags || [],
          stock,
          status,
          categoryId,
          specs: {
            create: specs.map((s: any) => ({
              label: s.label,
              value: s.value,
            })),
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
          specs: {
            omit: {
              createdAt: true,
              updatedAt: true,
              productId: true,
            },
          },
          category: true,
          variants: {
            omit: {
              createdAt: true,
              updatedAt: true,
              productId: true,
            },
            include: {
              options: {
                omit: {
                  createdAt: true,
                  updatedAt: true,
                  variantId: true,
                },
              },
            },
          },
        },
      });
    });

    return successResponse(product, "Product updated successfully");
  } catch (err: unknown) {
    return errorResponse(err);
  }
}