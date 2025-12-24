"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Input, Pagination } from "antd";
import { Product, ProductType } from "@/hooks/useProducts";
import {
  SearchOutlined,
  EyeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Image from "next/image";

interface ProductsListingProps {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  currentProductType?: ProductType;
  currentSearch?: string;
}

export default function ProductsListing({
  products,
  pagination,
  currentProductType,
  currentSearch,
}: ProductsListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(currentSearch || "");

  const getProductImage = (product: Product): string => {
    let imageUrl: string | null = null;

    if (product.images && product.images.length > 0 && product.images[0]) {
      imageUrl = product.images[0];
    } else if (product.thumbnail) {
      imageUrl = product.thumbnail;
    } else {
      return "/image.png";
    }

    // Validate URL for Next.js Image component
    if (!imageUrl) return "/image.png";

    // If it's already an absolute URL, return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it starts with /, return as is
    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }

    // Otherwise, add leading slash for relative paths
    return `/${imageUrl}`;
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/san-pham?${params.toString()}`);
  };

  const handleProductTypeChange = (value: ProductType | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("productType", value);
    } else {
      params.delete("productType");
    }
    params.set("page", "1");
    router.push(`/san-pham?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/san-pham?${params.toString()}`);
  };

  const isExternalImage = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-pure-white mb-4">
          Danh mục tác phẩm
        </h1>
        <p className="text-muted-blue text-lg">
          Khám phá bộ sưu tập nhiếp ảnh và quay phim của chúng tôi
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 glass-card rounded-2xl p-6 border border-spirit-cyan/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-muted-blue" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              allowClear
              className="w-full"
            />
          </div>

          {/* Product Type Filter */}
          <div>
            <Select
              value={currentProductType || undefined}
              onChange={handleProductTypeChange}
              placeholder="Tất cả loại"
              allowClear
              className="w-full"
              options={[
                { label: "QUAY DỰNG", value: "QUAY_DUNG" },
                { label: "THIẾT KẾ", value: "THIET_KE" },
                { label: "CHỤP - CHỈNH ẢNH", value: "CHUP_CHINH_ANH" },
              ]}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-moonlight-light border border-spirit-cyan/20 rounded-xl p-1 w-fit md:w-full md:justify-end">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-secondary-cyan text-midnight font-medium"
                  : "text-muted-blue hover:text-spirit-cyan"
              }`}
            >
              <AppstoreOutlined />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-secondary-cyan text-midnight font-medium"
                  : "text-muted-blue hover:text-spirit-cyan"
              }`}
            >
              <UnorderedListOutlined />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-spirit-cyan/20 text-center">
          <p className="text-muted-blue text-lg">Không tìm thấy sản phẩm</p>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => {
              const imageUrl = getProductImage(product);
              const isExternal = isExternalImage(imageUrl);
              return (
                <Link
                  key={product._id}
                  href={`/san-pham/${product._id}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden glass-card border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all hover-lift"
                >
                  {imageUrl && imageUrl !== "/image.png" ? (
                    isExternal ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-midnight">
                      <span className="text-muted-blue">Không có hình ảnh</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-pure-white text-xl font-bold mb-2">
                      {product.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-golden text-midnight text-xs font-semibold rounded-full">
                      {product.productType === "QUAY_DUNG"
                        ? "QUAY DỰNG"
                        : product.productType === "THIET_KE"
                        ? "THIẾT KẾ"
                        : "CHỤP - CHỈNH ẢNH"}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-spirit-cyan/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <EyeOutlined className="text-ice-white text-lg" />
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
                  `${range[0]}-${range[1]} của ${total} sản phẩm`
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
              const isExternal = isExternalImage(imageUrl);
              return (
                <Link
                  key={product._id}
                  href={`/san-pham/${product._id}`}
                  className="group flex gap-6 glass-card rounded-2xl p-6 border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all hover-lift"
                >
                  <div className="w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-midnight">
                    {imageUrl && imageUrl !== "/image.png" ? (
                      isExternal ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={192}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-blue">Không có hình ảnh</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-pure-white text-xl font-bold mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-muted-blue text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1 bg-golden text-midnight text-xs font-semibold rounded-full">
                        {product.productType === "QUAY_DUNG"
                          ? "QUAY DỰNG"
                          : product.productType === "THIET_KE"
                          ? "THIẾT KẾ"
                          : "CHỤP - CHỈNH ẢNH"}
                      </span>
                      <EyeOutlined className="text-muted-blue ml-auto" />
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
                  `${range[0]}-${range[1]} của ${total} sản phẩm`
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

