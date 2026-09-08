import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/services/auth';
import { createReview, listReviews, reviewSchema } from '@/lib/services/reviews';

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
    return NextResponse.json({ success: false, message: 'Invalid pagination' }, { status: 400 });
  const requestedRating = Number(request.nextUrl.searchParams.get('rating')) || 0;
  const rating =
    Number.isInteger(requestedRating) && requestedRating >= 1 && requestedRating <= 5 ? requestedRating : undefined;
  const sortBy = request.nextUrl.searchParams.get('sortBy') === 'rating' ? 'rating' : 'createdAt';
  const order = request.nextUrl.searchParams.get('order') === 'asc' ? 'asc' : 'desc';
  try {
    const data = await listReviews((await params).slug, { page: page.data, limit: limit.data, rating, sortBy, order });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load reviews';
    return NextResponse.json({ success: false, message }, { status: message === 'Product not found' ? 404 : 400 });
  }
};

export const POST = async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 });
  try {
    const data = await createReview(session.user.id, (await params).slug, parsed.data);
    return NextResponse.json({ success: true, message: 'Review submitted successfully', data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && knownErrors.includes(error.message) ? error.message : 'Unable to submit review';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
};
