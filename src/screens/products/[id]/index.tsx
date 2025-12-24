"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import { useProduct, ProductType } from "@/hooks/useProducts";
import ProductDetail from "../components/ProductDetail";
import { Product } from "@/hooks/useProducts";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: product, isLoading: isLoadingProduct } = useProduct(id);

  const { data: relatedProductsData } = useQuery({
    queryKey: ["relatedProducts", product?.productType, product?._id],
    queryFn: () =>
      getProducts({
        productType: product?.productType as ProductType,
        limit: 6,
      }),
    enabled: !!product?.productType,
  });

  const relatedProducts =
    relatedProductsData?.data?.filter((p: Product) => p._id !== product?._id) ||
    [];

  if (isLoadingProduct) {
    return <LoadingScreen message="Đang tải chi tiết sản phẩm..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-midnight">
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-muted-blue text-lg">Không tìm thấy sản phẩm</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <main className="pt-20">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </main>
    </div>
  );
}
