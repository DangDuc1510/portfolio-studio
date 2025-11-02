import { getProducts, getCategories } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsListing from "@/components/products/ProductsListing";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const filters = {
    page,
    limit: 12,
    ...(searchParams.category && { category: searchParams.category }),
    ...(searchParams.search && { search: searchParams.search }),
  };

  const [productsData, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  const products = productsData?.data || [];
  const pagination = {
    total: productsData?.total || 0,
    page: productsData?.page || 1,
    limit: productsData?.limit || 12,
    totalPages: productsData?.totalPages || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <Header />
      <main className="pt-20">
        <ProductsListing
          products={products}
          categories={categories}
          pagination={pagination}
          currentCategory={searchParams.category}
          currentSearch={searchParams.search}
        />
      </main>
      <Footer />
    </div>
  );
}

