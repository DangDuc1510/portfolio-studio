"use client";
import Link from "next/link";
import {
  useProducts,
  useDeleteProduct,
  Product,
} from "./hooks/useProducts";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function ProductsListPage() {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Products</h1>
          <p className="text-gray-400">
            Manage your product catalog ({products.length} items)
          </p>
        </div>
        <Link
          href="/studio-manage/cms/products/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-xl transition-all border border-white/10"
        >
          <PlusOutlined />
          <span>Create Product</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-gray-400 text-lg mb-6">No products found</p>
          <Link
            href="/studio-manage/cms/products/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-xl transition-all border border-white/10"
          >
            <PlusOutlined />
            <span>Create Your First Product</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              {product.images && product.images.length > 0 && (
                <div className="mb-4 rounded-xl overflow-hidden bg-[#2C2C2C] aspect-video flex items-center justify-center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {product.description || "No description"}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#2C2C2C] border border-white/10 rounded-lg text-xs text-gray-300">
                  {product.category || "Uncategorized"}
                </span>
                {product.albumId && (
                  <span className="px-3 py-1 bg-[#2C2C2C] border border-white/10 rounded-lg text-xs text-gray-300">
                    Album: {product.albumId.slice(0, 8)}...
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/studio-manage/cms/products/edit/${product.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-lg transition-all border border-white/10"
                >
                  <EditOutlined />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deleteProduct.isPending}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
