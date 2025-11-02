"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Select, Input, Pagination } from "antd";
import { useProducts, useDeleteProduct, Product } from "./hooks/useProducts";
import { useAlbums, Album } from "../albums/hooks/useAlbums";
import { useCategories, Category } from "../categories/hooks/useCategories";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export default function ProductsListPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Build filters object
  const filters = useMemo(() => {
    const filterObj: {
      search?: string;
      category?: string;
      albumId?: string;
      page?: number;
      limit?: number;
    } = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchQuery) filterObj.search = searchQuery;
    if (selectedCategory) filterObj.category = selectedCategory;
    if (selectedAlbum) filterObj.albumId = selectedAlbum;

    return filterObj;
  }, [searchQuery, selectedCategory, selectedAlbum, currentPage, pageSize]);

  const { data, isLoading } = useProducts(filters);
  const products = data?.data || [];
  const pagination = {
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 12,
    totalPages: data?.totalPages || 0,
  };

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };
  const { data: albums = [] } = useAlbums();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();

  const getAlbumName = (albumId: string) => {
    const album = albums.find((a: Album) => a._id === albumId);
    return album?.name || null;
  };

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
            Manage your product catalog ({pagination.total} items)
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-[#2C2C2C]/80 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-b from-[#4B4B4B] to-[#41411] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <AppstoreOutlined />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-gradient-to-b from-[#4B4B4B] to-[#41411] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <UnorderedListOutlined />
            </button>
          </div>
          <Link
            href="/studio-manage/cms/products/create"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-xl transition-all border border-white/10"
          >
            <PlusOutlined />
            <span>Create Product</span>
          </Link>
        </div>
      </div>

      {/* Filters and Search - Show for both grid and list modes */}
      <div className="mb-6 bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Search by Name
            </label>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange();
              }}
              className="w-full ant-select-selector"
              allowClear
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Filter by Category
            </label>
            <Select
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
                handleFilterChange();
              }}
              placeholder="All Categories"
              allowClear
              className="w-full"
              options={categories.map((cat: Category) => ({
                label: cat.name,
                value: cat.name,
              }))}
            />
          </div>

          {/* Album Filter */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Filter by Album
            </label>
            <Select
              value={selectedAlbum}
              onChange={(value) => {
                setSelectedAlbum(value);
                handleFilterChange();
              }}
              placeholder="All Albums"
              allowClear
              className="w-full"
              options={albums.map((album: Album) => ({
                label: album.name,
                value: album._id,
              }))}
            />
          </div>
        </div>
      </div>

      {products.length === 0 && pagination.total === 0 ? (
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-gray-400 text-lg mb-6">
            {searchQuery || selectedCategory || selectedAlbum
              ? "No products match your filters"
              : "No products found"}
          </p>
          {!searchQuery && !selectedCategory && !selectedAlbum && (
            <Link
              href="/studio-manage/cms/products/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-xl transition-all border border-white/10"
            >
              <PlusOutlined />
              <span>Create Your First Product</span>
            </Link>
          )}
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <div
                  key={product._id}
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
                    {product.albumId && getAlbumName(product.albumId) && (
                      <span className="px-3 py-1 bg-[#2C2C2C] border border-white/10 rounded-lg text-xs text-gray-300">
                        Album: {getAlbumName(product.albumId)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/studio-manage/cms/products/edit/${product._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-lg transition-all border border-white/10"
                    >
                      <EditOutlined />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={deleteProduct.isPending}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {products.map((product: Product) => (
                <div
                  key={product._id}
                  className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    {product.images && product.images.length > 0 && (
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#2C2C2C] flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {product.description || "No description"}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-[#2C2C2C] border border-white/10 rounded-lg text-xs text-gray-300">
                              {product.category || "Uncategorized"}
                            </span>
                            {product.albumId &&
                              getAlbumName(product.albumId) && (
                                <span className="px-3 py-1 bg-[#2C2C2C] border border-white/10 rounded-lg text-xs text-gray-300">
                                  Album: {getAlbumName(product.albumId)}
                                </span>
                              )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Link
                            href={`/studio-manage/cms/products/edit/${product._id}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-b from-[#4B4B4B] to-[#41411] hover:from-[#5B5B5B] hover:to-[#4B4B4B] text-white rounded-lg transition-all border border-white/10"
                          >
                            <EditOutlined />
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(product._id, product.name)
                            }
                            disabled={deleteProduct.isPending}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                pageSizeOptions={["12", "24", "48", "96"]}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
                onShowSizeChange={(current, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                }}
                className="custom-pagination"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
