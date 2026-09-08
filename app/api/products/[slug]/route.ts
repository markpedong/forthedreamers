import {apiProductBySlug} from '@/lib/services/catalog';
import { errorResponse, successResponse } from '@/lib/server-helper';
import { NextRequest } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string; }> }) {
  const { slug } = await params;

  try {
    const product = await apiProductBySlug(slug)

    if (!product) {
      return errorResponse("Product not found");
    }

    return successResponse({ data: product });
  } catch (error) {
    return errorResponse(error);
  }
}
