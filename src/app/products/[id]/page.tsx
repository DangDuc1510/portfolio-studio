import { getProductById, getProducts } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      notFound();
    }

    // Get related products (same category)
    const relatedProductsData = product.category
      ? await getProducts({ category: product.category, limit: 6 })
      : null;
    const relatedProducts = relatedProductsData?.data?.filter(
      (p: any) => p._id !== product._id
    ) || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
        <Header />
        <main className="pt-20">
          <ProductDetail product={product} relatedProducts={relatedProducts} />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    notFound();
  }
}

