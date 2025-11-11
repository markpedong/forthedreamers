import { PRODUCT_STATUS } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/server-helper";

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();

    const product = await prisma.product.findUnique({ where: { id }, select: { status: true } });
    if (!product) return errorResponse("Product not found");

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        status: product.status === PRODUCT_STATUS.ACTIVE
          ? PRODUCT_STATUS.INACTIVE
          : PRODUCT_STATUS.ACTIVE,
      },
    });

    return successResponse(updatedProduct);
  } catch (err: unknown) {
    return errorResponse(err);
  }
}
