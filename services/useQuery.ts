'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getCategories,
  getCartCount,
  getOrders,
  getProductFacets,
  getReviews,
  getSupportTicket,
  getSupportTickets,
  getWishlistIds,
  getWishlistItems,
  searchProducts,
  type ProductSearchParams,
} from '@/lib/http';

export const wishlistQueryKey = ['wishlist-ids'] as const;
export const productReviewsQueryKey = (slug: string) => ['product-reviews', slug] as const;
export const productsQueryKey = ['products'] as const;
export const productFacetsQueryKey = ['product-facets'] as const;
export const categoriesQueryKey = ['categories'] as const;
export const wishlistItemsQueryKey = ['wishlist-items'] as const;
export const ordersQueryKey = ['orders'] as const;
export const supportTicketsQueryKey = ['support-tickets'] as const;
export const cartCountQueryKey = ['cart-count'] as const;

export const useCartCountQuery = (enabled = true) =>
  useQuery({
    queryKey: cartCountQueryKey,
    queryFn: async () => (await getCartCount()).data?.count ?? 0,
    retry: false,
    enabled,
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
    staleTime: 1000 * 60,
  });

export const useWishlistQuery = (enabled: boolean | undefined = true) =>
  useQuery({
    queryKey: wishlistQueryKey,
    queryFn: async () => (await getWishlistIds()).data?.ids ?? [],
    staleTime: 1000 * 60,
    enabled,
  });

export const useProductsQuery = (filters: ProductSearchParams, enabled = true) =>
  useQuery({
    queryKey: [...productsQueryKey, filters],
    queryFn: ({ signal }) => searchProducts(filters, signal),
    select: result => result.data!,
    enabled,
    staleTime: 1000 * 30,
  });

export const useProductFacetsQuery = () =>
  useQuery({
    queryKey: productFacetsQueryKey,
    queryFn: ({ signal }) => getProductFacets(signal),
    select: result => result.data!,
    staleTime: 1000 * 60 * 60,
  });

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: categoriesQueryKey,
    queryFn: getCategories,
    select: result => result.data ?? [],
    staleTime: 1000 * 60 * 10,
  });

export const useWishlistItemsQuery = (page: number) =>
  useQuery({
    queryKey: [...wishlistItemsQueryKey, page],
    queryFn: () => getWishlistItems(page),
    select: result => result.data!,
  });

export const useOrdersQuery = (page: number, status = '', sortBy = 'createdAt', order = 'desc') =>
  useQuery({
    queryKey: [...ordersQueryKey, page, status, sortBy, order],
    queryFn: () => getOrders(page, status, sortBy, order),
    select: result => result.data!,
  });

export const useSupportTicketsQuery = (page: number, status = '') =>
  useQuery({
    queryKey: [...supportTicketsQueryKey, page, status],
    queryFn: () => getSupportTickets(page, status),
    select: result => result.data!,
  });

export const useSupportTicketQuery = (id: string | null) =>
  useQuery({
    queryKey: [...supportTicketsQueryKey, id],
    queryFn: () => getSupportTicket(id!),
    select: result => result.data!,
    enabled: !!id,
  });
