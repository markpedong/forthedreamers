import prisma from "@/lib/prisma";
import { successResponse } from "@/lib/server-helper";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      variants: {
        include: {
          options: true,
        }
      }
    }
  })

  return successResponse(products);
}