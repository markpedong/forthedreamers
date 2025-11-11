'use server';

import { buildQueryParams } from "@/utils/helper";
import { ApiResponse, ProductFormData, TCreateSeller, TProduct } from "./types";
import { API_ROUTE } from "@/constants/enum";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: any;
};

export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  if (url.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    url = base + url;
  }

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

  // if (!res.ok) {
  //   throw new Error(data?.message || res.statusText || "Request failed");
  // }

  return data;
}

export const checkStore = async (storeName: string) => await apiFetch<{ exists: boolean }>('/api/store/check', {
  method: 'POST',
  body: { storeName },
});

export const createSeller = async ({ storeName, userID }: TCreateSeller) => await apiFetch('/api/seller', {
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
