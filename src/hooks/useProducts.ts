import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from "@/lib/api";

export type ProductType = "QUAY_DUNG" | "THIET_KE" | "CHUP_CHINH_ANH";

export interface PlatformLink {
  platform: "youtube" | "vimeo" | "drive" | "self_host";
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  productType: ProductType;
  albumId: string;
  videoUrl?: string;
  thumbnail?: string;

  // QUAY DỰNG fields
  platformLinks?: PlatformLink[];
  categoryText?: string;
  location?: string;
  equipmentIds?: string[];

  // THIẾT KẾ fields
  designType?: string;
  clientType?: string;
  toolsUsed?: string[];

  // CHỤP - CHỈNH ẢNH fields
  photographyType?: string;

  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
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
  productType?: ProductType;
  albumId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: filters ? [...productKeys.lists(), filters] : productKeys.lists(),
    queryFn: () => getProducts(filters),
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
    },
  });
}
