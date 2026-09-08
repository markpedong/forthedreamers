import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/services/auth';
import { createReview, listReviews, reviewSchema } from '@/lib/services/reviews';
import { errorResponse, successResponse } from '@/lib/server-helper';

const knownErrors = [
  'Product not found',
  'A paid purchase is required to review this product',
  'You have already reviewed this product',
];

export const GET = async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(10000)
    .safeParse(request.nextUrl.searchParams.get('page') ?? 1);
  const limit = z.coerce
    .number()
    .int()
    .min(1)
    .max(20)
    .safeParse(request.nextUrl.searchParams.get('limit') ?? 6);
  if (!page.success || !limit.success)
    return errorResponse('Invalid pagination', 400);
  const requestedRating = Number(request.nextUrl.searchParams.get('rating')) || 0;
  const rating =
    Number.isInteger(requestedRating) && requestedRating >= 1 && requestedRating <= 5 ? requestedRating : undefined;
  const sortBy = request.nextUrl.searchParams.get('sortBy') === 'rating' ? 'rating' : 'createdAt';
  const order = request.nextUrl.searchParams.get('order') === 'asc' ? 'asc' : 'desc';
  try {
    const data = await listReviews((await params).slug, { page: page.data, limit: limit.data, rating, sortBy, order });
    return successResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load reviews';
    return errorResponse(message, message === 'Product not found' ? 404 : 400);
  }
};

export const POST = async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  const session = await getSession();
  if (!session) return errorResponse('Unauthorized', 401);
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Invalid input data', 400);
  try {
    const data = await createReview(session.user.id, (await params).slug, parsed.data);
    return successResponse(data, 'Review submitted successfully', 201);
  } catch (error) {
    const message =
      error instanceof Error && knownErrors.includes(error.message) ? error.message : 'Unable to submit review';
    return errorResponse(message, 400);
  }
};
