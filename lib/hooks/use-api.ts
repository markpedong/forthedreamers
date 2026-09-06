import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiFetch,
  checkStore,
  createSeller,
  getProducts,
  getCategories,
  addCategory,
  updateCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getProduct,
} from '@/lib/http';
import type { TProduct, TCreateSeller, ApiResponse } from '@/lib/types';
import type { Category } from '@/generated/prisma';

// ─── Queries ───────────────────────────────────────────────────────────────

export const useProducts = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });
};

export const useProduct = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
  });
};

export const useCategories = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
  });
};

export const useCheckStore = (storeName: string | undefined) => {
  return useQuery({
    queryKey: ['storeCheck', storeName],
    queryFn: () => checkStore(storeName!),
    enabled: !!storeName,
  });
};

// ─── Mutations ─────────────────────────────────────────────────────────────

export const useCreateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeCheck'] });
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => addCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory({ id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Parameters<typeof createProduct>[0]) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Parameters<typeof updateProduct>[0]) => updateProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => toggleProductStatus({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
