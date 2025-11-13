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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, categoryId, specs = [], variants = [], ...rest } =
      body as ProductFormData & { sellerId?: string };

    if (!id) return errorResponse("Product ID is required");
    if (!name || !categoryId)
      return errorResponse("Name and categoryId are required");

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { specs: true, variants: true },
    });

    if (!existingProduct) return errorResponse("Product not found");

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 🧩 Step 1: Update product main info
      await tx.product.update({
        where: { id },
        data: {
          name,
          slug: regenerateSlug(name),
          brand: rest.brand,
          basePrice: rest.basePrice ? Number(rest.basePrice) : 0,
          description: rest.description ?? "",
          images: rest.images ?? [],
          tags: rest.tags ?? [],
          stock: rest.stock ? Number(rest.stock) : 0,
          status: rest.status,
          category: { connect: { id: categoryId } },
        },
      });

      // 🧩 Step 2: Handle Specs Diff (Add / Update / Delete)
      const existingSpecs = existingProduct.specs;
      const incomingSpecs = specs;

      const specOps: any[] = [];

      // Check for create/update
      for (const incoming of incomingSpecs) {
        const existing = existingSpecs.find((s) => s.id === incoming.id);

        if (!existing) {
          // Create new
          specOps.push(
            tx.spec.create({
              data: {
                label: incoming.label,
                value: incoming.value,
                productId: id,
              },
            })
          );
        } else if (
          existing.label !== incoming.label ||
          existing.value !== incoming.value
        ) {
          // Update changed
          specOps.push(
            tx.spec.update({
              where: { id: existing.id },
              data: {
                label: incoming.label,
                value: incoming.value,
              },
            })
          );
        }
      }

      // Delete removed specs
      const incomingSpecIds = incomingSpecs.map((s) => s.id);
      const specsToDelete = existingSpecs.filter(
        (s) => !incomingSpecIds.includes(s.id)
      );
      for (const spec of specsToDelete) {
        specOps.push(tx.spec.delete({ where: { id: spec.id } }));
      }

      // 🧩 Step 3: Handle Variants Diff (Add / Update / Delete)
      const existingVariants = existingProduct.variants;
      const incomingVariants = variants;

      const variantOps: any[] = [];

      for (const incoming of incomingVariants) {
        const existing = existingVariants.find((v) => v.id === incoming.id);

        if (!existing) {
          // Create new
          variantOps.push(
            tx.variant.create({
              data: {
                name: incoming.name,
                price: Number(incoming.price),
                discountedPrice: incoming.discountedPrice
                  ? Number(incoming.discountedPrice)
                  : null,
                stock: Number(incoming.stock),
                coupon: incoming.coupon ?? null,
                image: incoming.image ?? null,
                attributes: incoming.attributes ?? {},
                productId: id,
              },
            })
          );
        } else {
          // Check if something changed
          const hasChanged =
            existing.name !== incoming.name ||
            existing.price !== Number(incoming.price) ||
            existing.discountedPrice !==
            (incoming.discountedPrice
              ? Number(incoming.discountedPrice)
              : null) ||
            existing.stock !== Number(incoming.stock) ||
            existing.coupon !== (incoming.coupon ?? null) ||
            existing.image !== (incoming.image ?? null) ||
            JSON.stringify(existing.attributes) !==
            JSON.stringify(incoming.attributes);

          if (hasChanged) {
            variantOps.push(
              tx.variant.update({
                where: { id: existing.id },
                data: {
                  name: incoming.name,
                  price: Number(incoming.price),
                  discountedPrice: incoming.discountedPrice
                    ? Number(incoming.discountedPrice)
                    : null,
                  stock: Number(incoming.stock),
                  coupon: incoming.coupon ?? null,
                  image: incoming.image ?? null,
                  attributes: incoming.attributes ?? {},
                },
              })
            );
          }
        }
      }

      // Delete removed variants
      const incomingVariantIds = incomingVariants.map((v) => v.id);
      const variantsToDelete = existingVariants.filter(
        (v) => !incomingVariantIds.includes(v.id)
      );
      for (const variant of variantsToDelete) {
        variantOps.push(tx.variant.delete({ where: { id: variant.id } }));
      }

      // 🧩 Step 4: Execute all batched operations
      await Promise.all([...specOps, ...variantOps]);

      // 🧩 Step 5: Return fully refreshed product
      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          specs: true,
          variants: true,
        },
      });
    });

    return successResponse(
      { data: updatedProduct },
      "Product updated successfully"
    );
  } catch (err: unknown) {
    console.error("PUT /product error:", err);
    return errorResponse(err);
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