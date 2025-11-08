'use server';

import { TCreateSeller, TProduct } from "./types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

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

  if (!res.ok) {
    throw new Error(data?.message || res.statusText || "Request failed");
  }

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

export const getProducts = async () => await apiFetch<TProduct[]>('/api/products');

export const getCategories = async () => await apiFetch('/api/category');

export const createProduct = async (productData: Partial<TProduct> & { sellerId: string }) => 
  await apiFetch<TProduct>('/api/products', {
    method: 'POST',
    body: productData,
  });

export const updateProduct = async (productData: Partial<TProduct> & { id: string }) => 
  await apiFetch<TProduct>('/api/products', {
    method: 'PUT',
    body: productData,
  });