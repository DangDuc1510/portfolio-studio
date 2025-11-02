"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getProducts, getCategories } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsListing from "@/components/products/ProductsListing";

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);

  // Get search params from window.location.search
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setPage(parseInt(params.get("page") || "1", 10));
      setCategory(params.get("category") || undefined);
      setSearch(params.get("search") || undefined);
    }
  }, [pathname]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setPage(parseInt(params.get("page") || "1", 10));
      setCategory(params.get("category") || undefined);
      setSearch(params.get("search") || undefined);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const filters = {
    page,
    limit: 12,
    ...(category && { category }),
    ...(search && { search }),
  };

  // Fetch products using React Query
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  // Fetch categories using React Query
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const products = productsData?.data || [];
  const categoriesData = categories || [];
  const pagination = {
    total: productsData?.total || 0,
    page: productsData?.page || 1,
    limit: productsData?.limit || 12,
    totalPages: productsData?.totalPages || 0,
  };

  const isLoading = isLoadingProducts || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ProductsListing
      products={products}
      categories={categoriesData}
      pagination={pagination}
      currentCategory={category}
      currentSearch={search}
    />
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <Header />
      <main className="pt-20">
        <ProductsContent />
      </main>
      <Footer />
    </div>
  );
}
