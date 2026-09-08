import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/services/auth';
import { setWishlist, wishlistIds, wishlistItems } from '@/lib/services/wishlist';
import { errorResponse, successResponse } from '@/lib/server-helper';

const idSchema = z.string().min(1).max(100);

export const GET = async (request: NextRequest) => {
  const session = await getSession();
  if (!session) return errorResponse('Unauthorized', 401);
  if (request.nextUrl.searchParams.get('ids') === 'true') {
    return successResponse({ ids: await wishlistIds(session.user.id) });
  }
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .safeParse(request.nextUrl.searchParams.get('page') ?? 1);
  const limit = z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .safeParse(request.nextUrl.searchParams.get('limit') ?? 20);
  if (!page.success || !limit.success)
    return errorResponse('Invalid pagination', 400);
  return successResponse(await wishlistItems(session.user.id, page.data, limit.data));
};

const change = async (request: NextRequest, wanted: boolean) => {
  const session = await getSession();
  if (!session)
    return errorResponse('Please sign in to save products', 401);
  const rawId = wanted
    ? (await request.json().catch(() => null))?.productId
    : request.nextUrl.searchParams.get('productId');
  const parsed = idSchema.safeParse(rawId);
  if (!parsed.success) return errorResponse('Invalid product', 400);
  try {
    const data = await setWishlist(session.user.id, parsed.data, wanted);
    return successResponse(data, wanted ? 'Added to wishlist' : 'Removed from wishlist');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update wishlist', 400);
  }
};

export const POST = (request: NextRequest) => change(request, true);
export const DELETE = (request: NextRequest) => change(request, false);
