"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import ProductsListing from "./components/ProductsListing";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  // Get params from URL directly using Next.js useSearchParams (no polling needed)
  const page = parseInt(searchParams.get("page") || "1", 10);
  const productTypeParam = searchParams.get("productType");
  const productType: "QUAY_DUNG" | "THIET_KE" | "CHUP_CHINH_ANH" | undefined =
    productTypeParam === "QUAY_DUNG" ||
    productTypeParam === "THIET_KE" ||
    productTypeParam === "CHUP_CHINH_ANH"
      ? productTypeParam
      : undefined;
  const search = searchParams.get("search") || undefined;

  const filters = {
    page,
    limit: 12,
    ...(productType && { productType }),
    ...(search && { search }),
  };

  // Fetch products using React Query
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  const products = productsData?.data || [];
  const pagination = {
    total: productsData?.total || 0,
    page: productsData?.page || 1,
    limit: productsData?.limit || 12,
    totalPages: productsData?.totalPages || 0,
  };

  const isLoading = isLoadingProducts;

  if (isLoading) {
    return <LoadingScreen message="Đang tải sản phẩm..." />;
  }

  return (
    <div className="min-h-screen bg-hero-gradient hero-animated-bg relative overflow-hidden">
      <main className="pt-20 relative z-10 hero-animated-bg-inner">
        <ProductsListing
          products={products}
          pagination={pagination}
          currentProductType={productType}
          currentSearch={search}
        />
      </main>
    </div>
  );
}
