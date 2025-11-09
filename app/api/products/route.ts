import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/server-helper";
import { regenerateSlug } from "@/utils/helper";
import { NextRequest } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      specs: {
        omit: {
          createdAt: true,
          updatedAt: true,
          productId: true,
        }
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
            }
          },
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  })

  return successResponse(products);
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

    if (!name || !categoryId) {
      return errorResponse("Name, slug, categoryId are required");
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: sellerId },
    });

    if (!seller) {
      return errorResponse("Seller not found for the given userId");
    }

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
          create: specs.map((spec: any) => ({
            label: spec.label,
            value: spec.value,
          })),
        },
        variants: {
          create: variants.map((variant: any) => ({
            name: variant.name,
            isRequired: variant.isRequired ?? true,
            options: {
              create: (variant.options || []).map((option: any) => ({
                variantOptionName: option.variantOptionName,
                price: option.price,
                discountedPrice: option.discountedPrice,
                stock: option.stock,
                coupon: option.coupon,
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
          }
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
              }
            },
          }
        }
      }
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

    if (!id) {
      return errorResponse("Product ID is required");
    }

    if (!name || !categoryId) {
      return errorResponse("Name, slug, and categoryId are required");
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse("Product not found");
    }

    const existingVariants = await prisma.variant.findMany({
      where: { productId: id },
      select: { id: true },
    });

    const variantIds = existingVariants.map((v) => v.id);

    await prisma.spec.deleteMany({
      where: { productId: id },
    });

    if (variantIds.length > 0) {
      await prisma.variantOption.deleteMany({
        where: { variantId: { in: variantIds } },
      });
    }

    await prisma.variant.deleteMany({
      where: { productId: id },
    });

    const product = await prisma.product.update({
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
          create: specs.map((spec: any) => ({
            label: spec.label,
            value: spec.value,
          })),
        },
        variants: {
          create: variants.map((variant: any) => ({
            name: variant.name,
            isRequired: variant.isRequired ?? true,
            options: {
              create: (variant.options || []).map((option: any) => ({
                variantOptionName: option.variantOptionName,
                price: option.price,
                discountedPrice: option.discountedPrice ?? null,
                stock: option.stock,
                coupon: option.coupon ?? null,
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
          }
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
              }
            },
          }
        }
      }
    });

    return successResponse(product, "Product updated successfully");
  } catch (err: unknown) {
    return errorResponse(err);
  }
}