'use client';

import { toast } from 'sonner';
import { API_ROUTE } from '@/constants/enum';
import type { CartItem } from './services/cart';
import type { ApiResponse, ApiSuccessResponse, ProductFormData, TProduct } from './types';
import type { TUserData } from '@/services/types';

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  basePrice: number | null;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number | null;
  category: { id: string; name: string };
  seller: { storeName: string };
  variants: { id: string; name: string; price: number; discountedPrice: number | null; stock: number }[];
};

export type ProductSearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minRating?: string | number;
  maxRating?: string | number;
  inStock?: '0' | '1' | '';
  sortBy?: 'name' | 'price' | 'basePrice' | 'rating' | 'sold' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export type ProductsResult = {
  products: CatalogProduct[];
  total?: number;
  page: number;
  limit: number;
  hasMore: boolean;
  categories: { id: string; name: string }[];
  brands: string[];
};

export type CategoryResult = { id: string; name: string; _count: { products: number } };
export type WishlistResult = {
  wishlist: { id: string; addedAt: string; product: CatalogProduct }[];
  total: number;
  page: number;
  limit: number;
};

export type OrderResult = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  orderGroup: { paymentStatus: string } | null;
  seller: { storeName: string } | null;
  orderItems: {
    id: string;
    quantity: number;
    finalPriceAfterDiscount: number;
    product: { id: string; name: string; slug: string; images: string[] } | null;
    variant: { id: string; name: string };
  }[];
};

export type OrdersResult = { orders: OrderResult[]; total: number; page: number; limit: number };
export type SupportMessageResult = {
  id: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
};
export type SupportTicketResult = {
  id: string;
  subject: string;
  message: string;
  category: 'ORDER' | 'PRODUCT' | 'SHIPPING' | 'ACCOUNT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  messages?: SupportMessageResult[];
};
export type SupportTicketsResult = {
  tickets: SupportTicketResult[];
  total: number;
  page: number;
  limit: number;
};

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  showErrorToast?: boolean;
};

export const apiFetch = async <T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiSuccessResponse<T>> => {
  const { body, showErrorToast = true, ...requestOptions } = options;
  const isFormData = body instanceof FormData;
  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...requestOptions.headers,
    },
    body: body === undefined ? undefined : isFormData || typeof body === 'string' ? body : JSON.stringify(body),
  });
  const data = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    const message = data?.message || response.statusText || 'Request failed';
    if (showErrorToast) toast.error(message);
    throw new Error(message);
  }

  if (!data?.success) throw new Error(data?.message || 'Invalid server response');
  return data;
};

export const addCategory = (name: string) => apiFetch(API_ROUTE.CATEGORIES, { method: 'POST', body: { name } });

export const createProduct = (productData: ProductFormData) =>
  apiFetch<TProduct>(API_ROUTE.PRODUCTS, { method: 'POST', body: productData });

export const updateProduct = (productData: ProductFormData) =>
  apiFetch<TProduct>(API_ROUTE.PRODUCTS, { method: 'PUT', body: productData });

export const uploadProductImages = (files: File[]) => {
  const body = new FormData();
  files.forEach(file => body.append('images', file));
  return apiFetch<string[]>(API_ROUTE.PRODUCT_IMAGES, { method: 'POST', body, showErrorToast: false });
};

export const deleteProduct = (id: string) => apiFetch(API_ROUTE.PRODUCTS, { method: 'DELETE', body: { id } });

export const toggleProductStatus = ({ id, active }: { id: string; active: boolean }) =>
  apiFetch(`${API_ROUTE.PRODUCTS}/toggle`, { method: 'PATCH', body: { id, active } });

// ─── Customer catalog ─────────────────────────────────────────────────────

const withSearchParams = (path: string, values: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export const searchProducts = (filters: ProductSearchParams) =>
  apiFetch<ProductsResult>(withSearchParams('/api/products/search', filters), {
    cache: 'no-store',
    showErrorToast: false,
  });

export const getCategories = () =>
  apiFetch<CategoryResult[]>(API_ROUTE.CATEGORIES, { cache: 'no-store', showErrorToast: false });

// ─── Cart ──────────────────────────────────────────────────────────────────

type CartMutationData = {
  item: CartItem | null;
  removedId: string | null;
  count: number;
};

export const removeCartItem = (cartItemId: string) =>
  apiFetch<CartMutationData>(`${API_ROUTE.CART}?id=${cartItemId}`, { method: 'DELETE', showErrorToast: false });

export const addCartItem = ({ variantId, quantity }: { variantId: string; quantity: number }) =>
  apiFetch<CartMutationData>(API_ROUTE.CART, { method: 'POST', body: { variantId, quantity }, showErrorToast: false });

export const updateCartQuantity = ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
  apiFetch<CartMutationData>(API_ROUTE.CART, { method: 'PUT', body: { cartItemId, quantity }, showErrorToast: false });

export const checkoutCart = () => apiFetch<{ orderGroupId: string }>(`${API_ROUTE.CART}/checkout`, { method: 'POST' });

// ─── Wishlist ──────────────────────────────────────────────────────────────

export const getWishlistIds = () =>
  apiFetch<{ ids: string[] }>('/api/wishlist?ids=true', { cache: 'no-store', showErrorToast: false });

export const setWishlist = (productId: string, wanted: boolean) =>
  apiFetch<{ productId: string; wanted: boolean }>(
    wanted ? '/api/wishlist' : `/api/wishlist?productId=${encodeURIComponent(productId)}`,
    {
      method: wanted ? 'POST' : 'DELETE',
      body: wanted ? { productId } : undefined,
      showErrorToast: false,
    }
  );

export const getWishlistItems = (page: number, limit = 20) =>
  apiFetch<WishlistResult>(withSearchParams('/api/wishlist', { page, limit }), {
    cache: 'no-store',
    showErrorToast: false,
  });

// ─── Orders and support ───────────────────────────────────────────────────

export const getOrders = (page: number, status = '', sortBy = 'createdAt', order = 'desc') =>
  apiFetch<OrdersResult>(withSearchParams('/api/orders', { page, limit: 10, status, sortBy, order }), {
    cache: 'no-store',
    showErrorToast: false,
  });

export const getSupportTickets = (page: number, status = '') =>
  apiFetch<SupportTicketsResult>(withSearchParams('/api/support/tickets', { page, limit: 10, status }), {
    cache: 'no-store',
    showErrorToast: false,
  });

export const getSupportTicket = (id: string) =>
  apiFetch<SupportTicketResult>(`/api/support/tickets/${encodeURIComponent(id)}`, {
    cache: 'no-store',
    showErrorToast: false,
  });

export const createSupportTicket = (input: {
  subject: string;
  message: string;
  category: SupportTicketResult['category'];
  priority: SupportTicketResult['priority'];
}) => apiFetch<SupportTicketResult>('/api/support/tickets', { method: 'POST', body: input, showErrorToast: false });

export const sendSupportMessage = ({ ticketId, message }: { ticketId: string; message: string }) =>
  apiFetch<SupportMessageResult>(`/api/support/tickets/${encodeURIComponent(ticketId)}/messages`, {
    method: 'POST',
    body: { message },
    showErrorToast: false,
  });

// ─── Auth and profile ───────────────────────────────────────────────────────

export const getCurrentUser = () => apiFetch<TUserData>('/api/auth/me', { cache: 'no-store', showErrorToast: false });
export const signIn = (input: { email: string; password: string; portal: 'customer' | 'dashboard' }) =>
  apiFetch<TUserData>('/api/auth/sign-in', { method: 'POST', body: input, showErrorToast: false });
export const signUp = (input: { email: string; password: string; name: string }) =>
  apiFetch('/api/auth/sign-up', { method: 'POST', body: input, showErrorToast: false });
export const sellerSignUp = (input: unknown) =>
  apiFetch(API_ROUTE.SELLER, { method: 'POST', body: input, showErrorToast: false });
export const socialSignIn = (provider: 'google', next: '/profile' | '/dashboard') =>
  apiFetch<{ url: string }>('/api/auth/oauth', { method: 'POST', body: { provider, next }, showErrorToast: false });
export const linkSocial = (provider: string, next: string) =>
  apiFetch<{ url: string }>('/api/auth/link', { method: 'POST', body: { provider, next }, showErrorToast: false });
export const sendForgotPassword = (email: string, redirectTo?: string) =>
  apiFetch('/api/auth/password/forgot', { method: 'POST', body: { email, redirectTo }, showErrorToast: false });
export const resetPassword = (token: string, password: string) =>
  apiFetch('/api/auth/password/reset', { method: 'PUT', body: { token, password }, showErrorToast: false });
export const signOut = () => apiFetch('/api/auth/sign-out', { method: 'POST', showErrorToast: false });
export const changePassword = (password: string) =>
  apiFetch('/api/profile/password', { method: 'PATCH', body: { password }, showErrorToast: false });
export const updateProfile = (input: { name: string } | { image: string }) =>
  apiFetch<{ user: TUserData }>('/api/profile', { method: 'PATCH', body: input, showErrorToast: false });
export const resendVerification = () =>
  apiFetch('/api/profile/verification', { method: 'POST', showErrorToast: false });
export const createAddress = (input: unknown) =>
  apiFetch('/api/profile/addresses', { method: 'POST', body: input, showErrorToast: false });
export const updateAddress = (input: unknown) =>
  apiFetch('/api/profile/addresses', { method: 'PUT', body: input, showErrorToast: false });
export const deleteAddress = (id: string) =>
  apiFetch(`/api/profile/addresses?id=${encodeURIComponent(id)}`, { method: 'DELETE', showErrorToast: false });
export const setDefaultAddress = (id: string) =>
  apiFetch('/api/profile/addresses', { method: 'PATCH', body: { id }, showErrorToast: false });
export const setUserBanned = (userId: string, banned: boolean) =>
  apiFetch('/api/admin/users', { method: 'PATCH', body: { userId, banned }, showErrorToast: false });
export const deleteUser = (userId: string) =>
  apiFetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, { method: 'DELETE', showErrorToast: false });

// ─── Reviews ────────────────────────────────────────────────────────────────

export const getReviews = <T>(slug: string, page: number, rating: number | null, limit = 6) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (rating) params.set('rating', String(rating));
  return apiFetch<T>(`/api/products/${encodeURIComponent(slug)}/reviews?${params}`, {
    cache: 'no-store',
    showErrorToast: false,
  });
};
export const createReview = (slug: string, input: unknown) =>
  apiFetch(`/api/products/${encodeURIComponent(slug)}/reviews`, { method: 'POST', body: input, showErrorToast: false });
