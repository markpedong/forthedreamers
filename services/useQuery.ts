'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getReviews, getWishlistIds } from '@/lib/http';

export const wishlistQueryKey = ['wishlist-ids'] as const;
export const productReviewsQueryKey = (slug: string) => ['product-reviews', slug] as const;

export const useCurrentUserQuery = () =>
  useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    select: result => result.data,
    retry: false,
  });

export const useProductReviewsQuery = <Review>(
  slug: string,
  page: number,
  rating: number | null,
  pageSize: number,
  initialData?: { reviews: Review[]; total: number }
) =>
  useQuery({
    queryKey: [...productReviewsQueryKey(slug), rating, page],
    queryFn: () => getReviews<{ reviews: Review[]; total: number }>(slug, page, rating, pageSize),
    select: result => result.data,
    initialData: initialData ? { success: true as const, data: initialData } : undefined,
  });

export const useWishlistQuery = () =>
  useQuery({
    queryKey: wishlistQueryKey,
    queryFn: async () => (await getWishlistIds()).data?.ids ?? [],
    staleTime: 1000 * 60,
  });
