"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Input, Pagination } from "antd";
import { Product } from "@/app/studio-manage/cms/products/hooks/useProducts";
import { Category } from "@/app/studio-manage/cms/categories/hooks/useCategories";
import {
  SearchOutlined,
  EyeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

interface ProductsListingProps {
  products: Product[];
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentCategory?: string;
  currentSearch?: string;
}

export default function ProductsListing({
  products,
  categories,
  pagination,
  currentCategory,
  currentSearch,
}: ProductsListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(currentSearch || "");

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.thumbnail) {
      return product.thumbnail;
    }
    return null;
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Portfolio
        </h1>
        <p className="text-gray-400 text-lg">
          Explore our collection of photography and videography works
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              allowClear
              className="w-full ant-select-selector"
            />
          </div>

          {/* Category Filter */}
          <div>
            <Select
              value={currentCategory || undefined}
              onChange={handleCategoryChange}
              placeholder="All Categories"
              allowClear
              className="w-full"
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat.name,
              }))}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-[#2C2C2C]/80 border border-white/10 rounded-xl p-1 w-fit md:w-full md:justify-end">
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
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-gray-400 text-lg">No products found</p>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => {
              const imageUrl = getProductImage(product);
              return (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#414141] to-[#2C2C2C] border border-white/10 hover:border-[#FFDD00]/50 transition-all"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xl font-bold mb-2">
                      {product.name}
                    </h3>
                    {product.category && (
                      <span className="inline-block px-3 py-1 bg-[#FFDD00] text-[#1C1C1C] text-xs font-semibold rounded-full">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <EyeOutlined className="text-white text-lg" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                onChange={handlePageChange}
                className="custom-pagination"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {products.map((product) => {
              const imageUrl = getProductImage(product);
              return (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group flex gap-6 bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] rounded-2xl p-6 border border-white/10 hover:border-[#FFDD00]/50 transition-all"
                >
                  <div className="w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[#2C2C2C]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      {product.category && (
                        <span className="inline-block px-3 py-1 bg-[#FFDD00] text-[#1C1C1C] text-xs font-semibold rounded-full">
                          {product.category}
                        </span>
                      )}
                      <EyeOutlined className="text-gray-400 ml-auto" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                onChange={handlePageChange}
                className="custom-pagination"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

