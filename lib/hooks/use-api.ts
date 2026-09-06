import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
    queryFn: async () => {
      try {
        return await getProducts(params);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load products');
        throw err;
      }
    },
  });
};

export const useProduct = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        return await getProduct(slug!);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load product');
        throw err;
      }
    },
    enabled: !!slug,
  });
};

export const useCategories = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      try {
        return await getCategories(params);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load categories');
        throw err;
      }
    },
  });
};

export const useCheckStore = (storeName: string | undefined) => {
  return useQuery({
    queryKey: ['storeCheck', storeName],
    queryFn: async () => {
      try {
        return await checkStore(storeName!);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to check store');
        throw err;
      }
    },
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
