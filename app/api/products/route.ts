import prisma from "@/lib/prisma";
import { successResponse } from "@/lib/server-helper";

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
      category: { select: { name: true } },
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
  })

  return successResponse(products);
}