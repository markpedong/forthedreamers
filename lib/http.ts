'use client';

import { buildQueryParams } from "@/utils/helper";
import { ApiResponse, ProductFormData, TCreateSeller, TProduct } from "./types";
import { API_ROUTE } from "@/constants/enum";
import { toast } from "sonner";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: any;
};

export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body
      ? typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || res.statusText || "Request failed";
    toast.error(message);
    throw new Error(message);
  }

  return data;
}

export const checkStore = async (storeName: string) => await apiFetch<{ exists: boolean }>(API_ROUTE.STORE_CHECK, {
  method: 'POST',
  body: { storeName },
});

export const createSeller = async ({ storeName, userID }: TCreateSeller) => await apiFetch(API_ROUTE.SELLER, {
  method: 'POST',
  body: { storeName, userID },
});

export const getProducts = async (params: any) => apiFetch<TProduct[]>(`${API_ROUTE.PRODUCTS}?${buildQueryParams(params)}`);

export const getCategories = async (params?: any) => apiFetch(`${API_ROUTE.CATEGORIES}?${buildQueryParams(params)}`);

export const addCategory = async (name: string) => apiFetch(API_ROUTE.CATEGORIES, { method: 'POST', body: { name } });

export const updateCategory = async ({ id, name }: { id: string; name: string }) => apiFetch(API_ROUTE.CATEGORIES, { method: 'PUT', body: { id, name } });

export const createProduct = async (productData: ProductFormData) => apiFetch<TProduct>(API_ROUTE.PRODUCTS, { method: 'POST', body: productData });

export const updateProduct = async (productData: ProductFormData) => apiFetch<TProduct>(API_ROUTE.PRODUCTS, { method: 'PUT', body: productData });

export const deleteProduct = async (id: string) => apiFetch(API_ROUTE.PRODUCTS, { method: 'DELETE', body: { id } });

export const toggleProductStatus = async ({ id }: { id: string }) => apiFetch(`${API_ROUTE.PRODUCTS}/toggle`, { method: 'PATCH', body: { id } });

export const getProduct = async (slug: string) => apiFetch<TProduct>(`${API_ROUTE.PRODUCTS}/${slug}`);

// ─── Cart ──────────────────────────────────────────────────────────────────

export const getCartItems = async () => apiFetch(API_ROUTE.CART);

export const removeCartItem = async (cartItemId: string) =>
  apiFetch(`${API_ROUTE.CART}?id=${cartItemId}`, { method: 'DELETE' });

export const addCartItem = async ({ variantId, quantity }: { variantId: string; quantity: number }) =>
  apiFetch(API_ROUTE.CART, { method: 'POST', body: { variantId, quantity } });

export const updateCartQuantity = async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
  apiFetch(API_ROUTE.CART, { method: 'PUT', body: { cartItemId, quantity } });

export const checkoutCart = async () =>
  apiFetch(`${API_ROUTE.CART}/checkout`, { method: 'POST' });