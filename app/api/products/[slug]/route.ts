import { getProductPrisma } from '@/lib/server-actions';
import { errorResponse, successResponse } from '@/lib/server-helper';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string; }> }) {
  const { slug } = await params;

  try {
    const product = await getProductPrisma(slug)

    if (!product) {
      return errorResponse("Product not found");
    }

    return successResponse({ data: product });
  } catch (error) {
    return errorResponse(error);
  }
}
