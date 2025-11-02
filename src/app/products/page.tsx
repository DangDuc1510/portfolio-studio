import { getProducts, getCategories } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductsListing from "@/components/products/ProductsListing";

// Disable static generation for dynamic data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const filters = {
    page,
    limit: 12,
    ...(resolvedSearchParams.category && {
      category: resolvedSearchParams.category,
    }),
    ...(resolvedSearchParams.search && { search: resolvedSearchParams.search }),
  };

  let products = [];
  let categories = [];
  let pagination = {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  };

  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(filters).catch((error) => {
        console.error("Error fetching products:", error);
        return {
          data: [],
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 0,
        };
      }),
      getCategories().catch((error) => {
        console.error("Error fetching categories:", error);
        return [];
      }),
    ]);

    products = productsData?.data || [];
    categories = categoriesData || [];
    pagination = {
      total: productsData?.total || 0,
      page: productsData?.page || 1,
      limit: productsData?.limit || 12,
      totalPages: productsData?.totalPages || 0,
    };

    // Debug logging
    console.log("Products fetched:", products.length);
    console.log("Categories fetched:", categories.length);
  } catch (error) {
    console.error("Error fetching products data:", error);
    // Continue with empty data to allow page to render
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <Header />
      <main className="pt-20">
        <ProductsListing
          products={products}
          categories={categories}
          pagination={pagination}
          currentCategory={resolvedSearchParams.category}
          currentSearch={resolvedSearchParams.search}
        />
      </main>
      <Footer />
    </div>
  );
}
