'use client';

import type { ProductFormData, TProduct } from '@/lib/types';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : endpoint;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body
      ? typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || res.statusText || 'Request failed');
  }

  return data;
}

export const createProduct = async (productData: ProductFormData & { sellerId: string }): Promise<ApiResponse<TProduct>> =>
  apiClient<TProduct>('/api/products', {
    method: 'POST',
    body: productData as any,
  });

export const updateProduct = async (productData: ProductFormData & { id: string }): Promise<ApiResponse<TProduct>> =>
  apiClient<TProduct>('/api/products', {
    method: 'PUT',
    body: productData as any,
  });

export const deleteProduct = async (id: string): Promise<ApiResponse<void>> =>
  apiClient<void>(`/api/products/${id}`, {
    method: 'DELETE',
  });

