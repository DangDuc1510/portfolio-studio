"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { getProducts } from "@/lib/api";
import ProductsListing from "./components/ProductsListing";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProductsPage() {
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [productType, setProductType] = useState<
    "QUAY_DUNG" | "THIET_KE" | "CHUP_CHINH_ANH" | undefined
  >(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const previousUrlRef = useRef<string>("");

  useEffect(() => {
    // Get search params from window.location.search
    const updateParams = () => {
      if (typeof window !== "undefined") {
        const currentUrl = window.location.href;
        // Only update if URL actually changed
        if (currentUrl !== previousUrlRef.current) {
          previousUrlRef.current = currentUrl;
          const params = new URLSearchParams(window.location.search);
          setPage(parseInt(params.get("page") || "1", 10));
          const productTypeParam = params.get("productType");
          if (
            productTypeParam === "QUAY_DUNG" ||
            productTypeParam === "THIET_KE" ||
            productTypeParam === "CHUP_CHINH_ANH"
          ) {
            setProductType(productTypeParam);
          } else {
            setProductType(undefined);
          }
          setSearch(params.get("search") || undefined);
        }
      }
    };

    // Initial load
    updateParams();

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      updateParams();
    };

    window.addEventListener("popstate", handlePopState);

    // Poll for URL changes (for Next.js router navigation)
    const interval = setInterval(() => {
      updateParams();
    }, 100);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearInterval(interval);
    };
  }, [pathname]);

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

