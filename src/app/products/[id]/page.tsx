"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProductById, getProducts } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";
import { Product } from "@/app/studio-manage/cms/products/hooks/useProducts";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const { data: relatedProductsData } = useQuery({
    queryKey: ["relatedProducts", product?.category],
    queryFn: () =>
      getProducts({ category: product?.category, limit: 6 }),
    enabled: !!product?.category,
  });

  const relatedProducts =
    relatedProductsData?.data?.filter(
      (p: Product) => p._id !== product?._id
    ) || [];

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">Product not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <Header />
      <main className="pt-20">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}

