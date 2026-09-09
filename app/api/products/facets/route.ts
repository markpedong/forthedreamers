import { productSearchFacets } from '@/lib/services/catalog';
import { errorResponse, successResponse } from '@/lib/server-helper';

export async function GET() {
  try {
    return successResponse(await productSearchFacets());
  } catch (error) {
    console.error('Product facets API error:', error);
    return errorResponse('Unable to load product filters', 500);
  }
}
