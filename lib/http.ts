'use client';

import { toast } from 'sonner';
import { API_ROUTE } from '@/constants/enum';
import type { CartItem } from './services/cart';
import type { ApiResponse, ApiSuccessResponse, ProductFormData, TProduct } from './types';
import type { TUserData } from '@/services/types';

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  showErrorToast?: boolean;
};

export const apiFetch = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<ApiSuccessResponse<T>> => {
  const { body, showErrorToast = true, ...requestOptions } = options;
  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...requestOptions.headers,
    },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
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

export const deleteProduct = (id: string) => apiFetch(API_ROUTE.PRODUCTS, { method: 'DELETE', body: { id } });

export const toggleProductStatus = ({ id, active }: { id: string; active: boolean }) =>
  apiFetch(`${API_ROUTE.PRODUCTS}/toggle`, { method: 'PATCH', body: { id, active } });

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

// ─── Auth and profile ───────────────────────────────────────────────────────

export const getCurrentUser = () => apiFetch<TUserData>('/api/auth/me', { cache: 'no-store', showErrorToast: false });
export const signIn = (input: { email: string; password: string; audience: 'user' | 'seller' }) =>
  apiFetch<{ role: string }>('/api/auth/sign-in', { method: 'POST', body: input, showErrorToast: false });
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
