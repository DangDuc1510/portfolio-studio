import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export type PageType = "QUAY_DUNG" | "THIET_KE" | "CHUP_CHINH_ANH";

export interface PageSettings {
  _id: string;
  pageType: PageType;
  title: string;
  description: string;
  backgroundImage?: string;
  featuredProductIds: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Get page settings
export function usePageSettings(pageType: PageType) {
  return useQuery({
    queryKey: ["pageSettings", pageType],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageSettings>(
        `/api/page-settings/${pageType}`
      );
      return data;
    },
  });
}

// Update page settings
export function useUpdatePageSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pageType,
      updates,
    }: {
      pageType: PageType;
      updates: Partial<PageSettings>;
    }) => {
      const { data } = await axiosInstance.patch<PageSettings>(
        `/api/page-settings/${pageType}`,
        updates
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pageSettings", data.pageType],
      });
    },
  });
}

// Get product filters
export interface ProductFilters {
  // Common filters
  years?: string[];

  // QUAY_DUNG
  locations?: string[];
  categories?: string[];
  equipment?: Array<{ _id: string; name: string }>;

  // THIET_KE
  designTypes?: string[];
  clientTypes?: string[];
  tools?: string[];

  // CHUP_CHINH_ANH
  photographyTypes?: string[];
}

export function useProductFilters(productType: PageType) {
  return useQuery({
    queryKey: ["productFilters", productType],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProductFilters>(
        `/api/products/filters/${productType}`
      );
      return data;
    },
  });
}

