import { errorResponse, successResponse } from '@/lib/server-helper';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        specs: {
          include: { options: true },
        },
        category: {},
        variants: {
          include: { options: true },
        },
      },
    });

    if (!product) {
      return errorResponse("Product not found");
    }

    return successResponse({ data: product });
  } catch (error) {
    return errorResponse(error);
  }
}
