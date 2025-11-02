"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getProducts, getCategories } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsListing from "@/components/products/ProductsListing";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <Header />
      <main className="pt-20">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-lg">Loading...</div>
          </div>
        ) : (
          <ProductsListing
            products={products}
            categories={categoriesData}
            pagination={pagination}
            currentCategory={category}
            currentSearch={search}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
