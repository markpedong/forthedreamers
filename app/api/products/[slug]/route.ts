import prisma from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/server-helper';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        specs: true,
        category: {},
        variants: true,
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
