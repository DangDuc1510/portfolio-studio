import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getProductCategories,
  createProduct,
  updateProductById,
  deleteProductById,
} from "@/lib/api";

export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  albumId: string;
}

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Get all products
export function useProducts(filters?: {
  search?: string;
  category?: string;
  albumId?: string;
}) {
  return useQuery({
    queryKey: filters
      ? [...productKeys.lists(), filters]
      : productKeys.lists(),
    queryFn: () => getProducts(filters),
  });
}

// Get product categories
export function useProductCategories() {
  return useQuery({
    queryKey: [...productKeys.all, "categories"],
    queryFn: getProductCategories,
  });
}

// Get single product
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...productKeys.all, "categories"] });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProductById(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: [...productKeys.all, "categories"] });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...productKeys.all, "categories"] });
    },
  });
}

