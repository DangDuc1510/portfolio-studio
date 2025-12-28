"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Select, Input, Pagination } from "antd";
import {
  useProducts,
  useDeleteProduct,
  Product,
  ProductType,
} from "@/hooks/useProducts";
import { useAlbums, Album } from "@/hooks/useAlbums";
import LoadingScreen from "@/components/LoadingScreen";
import {
  PlusOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  PictureOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import ProductCard from "./components/ProductCard";

export default function ProductsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedProductType, setSelectedProductType] = useState<
    ProductType | undefined
  >();
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object
  const filters = useMemo(() => {
    const filterObj: {
      search?: string;
      productType?: ProductType;
      albumId?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {
      page: currentPage,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: sortOrder,
    };

    if (debouncedSearchQuery) filterObj.search = debouncedSearchQuery;
    if (selectedProductType) filterObj.productType = selectedProductType;
    if (selectedAlbum) filterObj.albumId = selectedAlbum;

    return filterObj;
  }, [
    debouncedSearchQuery,
    selectedProductType,
    selectedAlbum,
    currentPage,
    pageSize,
    sortOrder,
  ]);

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

  const getProductTypeLabel = (type: ProductType): string => {
    const labels: Record<ProductType, string> = {
      QUAY_DUNG: "QUAY DỰNG",
      THIET_KE: "THIẾT KẾ",
      CHUP_CHINH_ANH: "CHỤP - CHỈNH ẢNH",
    };
    return labels[type];
  };

  // Reset to page 1 when debounced search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);
  const { data: albums = [] } = useAlbums();
  const deleteProduct = useDeleteProduct();

  const getAlbumName = (albumId: string) => {
    const album = albums.find((a: Album) => a._id === albumId);
    return album?.name || null;
  };

  // Helper function to extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string): string => {
    // Try maxresdefault first (HD), fallback to hqdefault
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getProductImage = (product: Product) => {
    let imageUrl: string | null = null;

    // For QUAY DỰNG products, try to get YouTube thumbnail if no image/thumbnail exists
    if (product.productType === "QUAY_DUNG") {
      // Check platformLinks first
      if (product.platformLinks && product.platformLinks.length > 0) {
        const youtubeLink = product.platformLinks.find(
          (link) => link.platform === "youtube"
        );
        if (youtubeLink) {
          const videoId = extractYouTubeVideoId(youtubeLink.url);
          if (videoId) {
            imageUrl = getYouTubeThumbnail(videoId);
          }
        }
      }

      // If no YouTube thumbnail found, check videoUrl
      if (!imageUrl && product.videoUrl) {
        const videoId = extractYouTubeVideoId(product.videoUrl);
        if (videoId) {
          imageUrl = getYouTubeThumbnail(videoId);
        }
      }
    }

    // Fallback to existing images/thumbnail
    if (!imageUrl) {
      if (product.images && product.images.length > 0 && product.images[0]) {
        imageUrl = product.images[0];
      } else if (product.thumbnail) {
        imageUrl = product.thumbnail;
      }
    }

    // Default fallback
    if (!imageUrl) {
      return "/image.png";
    }

    // Validate URL for Next.js Image component
    // Must be absolute URL (http:// or https://) or relative path starting with /
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

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Không thể xóa sản phẩm");
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Đang tải danh sách sản phẩm..." fullScreen={false} />;
  }
  return (
    <div className="text-ice-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-pure-white">Sản phẩm</h1>
          <p className="text-muted-blue">
            Quản lý danh mục sản phẩm của bạn ({pagination.total} mục)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/studio/cms/products/create"
            className="flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20 font-medium"
          >
            <PlusOutlined />
            <span>Tạo sản phẩm</span>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        {/* Filters Grid - Inline Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="group">
            <label className="flex items-center gap-2 text-ice-white text-sm font-medium mb-2">
              <SearchOutlined className="text-spirit-cyan" />
              <span>Tìm kiếm</span>
            </label>
            <Input
              placeholder="Nhập tên sản phẩm..."
              prefix={<SearchOutlined className="text-muted-blue" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full ant-select-selector"
              allowClear
            />
          </div>

          {/* Product Type Filter */}
          <div className="group">
            <label className="flex items-center gap-2 text-ice-white text-sm font-medium mb-2">
              <FilterOutlined className="text-spirit-cyan" />
              <span>Loại sản phẩm</span>
              {selectedProductType && (
                <span className="ml-auto px-2 py-0.5 bg-spirit-cyan/20 text-spirit-cyan text-xs rounded-full">
                  Đã chọn
                </span>
              )}
            </label>
            <Select
              value={selectedProductType}
              onChange={(value) => {
                setSelectedProductType(value);
                handleFilterChange();
              }}
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

          {/* Dự án Filter */}
          <div className="group">
            <label className="flex items-center gap-2 text-ice-white text-sm font-medium mb-2">
              <PictureOutlined className="text-soft-gold" />
              <span>Dự án</span>
              {selectedAlbum && (
                <span className="ml-auto px-2 py-0.5 bg-soft-gold/20 text-soft-gold text-xs rounded-full">
                  Đã chọn
                </span>
              )}
            </label>
            <Select
              value={selectedAlbum}
              onChange={(value) => {
                setSelectedAlbum(value);
                handleFilterChange();
              }}
              placeholder="Tất cả dự án"
              allowClear
              className="w-full"
              options={albums.map((album: Album) => ({
                label: album.name,
                value: album._id,
              }))}
            />
          </div>

          {/* Sort by Created At */}
          <div className="group">
            <label className="flex items-center gap-2 text-ice-white text-sm font-medium mb-2">
              <CalendarOutlined className="text-spirit-cyan" />
              <span>Sắp xếp</span>
            </label>
            <Select
              value={sortOrder}
              onChange={(value) => {
                setSortOrder(value);
                handleFilterChange();
              }}
              className="w-full"
              options={[
                {
                  label: (
                    <span className="flex items-center gap-2">
                      <SortDescendingOutlined />
                      Mới nhất trước
                    </span>
                  ),
                  value: "desc",
                },
                {
                  label: (
                    <span className="flex items-center gap-2">
                      <SortAscendingOutlined />
                      Cũ nhất trước
                    </span>
                  ),
                  value: "asc",
                },
              ]}
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        {(debouncedSearchQuery ||
          selectedProductType ||
          selectedAlbum ||
          sortOrder !== "desc") && (
          <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-spirit-cyan/10">
            <span className="text-muted-blue text-xs font-medium">
              Bộ lọc đang áp dụng:
            </span>
            {debouncedSearchQuery && (
              <span className="px-3 py-1 bg-spirit-cyan/20 text-spirit-cyan rounded-full text-xs font-semibold border border-spirit-cyan/30">
                Tìm kiếm: {debouncedSearchQuery}
              </span>
            )}
            {selectedProductType && (
              <span className="px-3 py-1 bg-spirit-cyan/20 text-spirit-cyan rounded-full text-xs font-semibold border border-spirit-cyan/30">
                {getProductTypeLabel(selectedProductType)}
              </span>
            )}
            {selectedAlbum && (
              <span className="px-3 py-1 bg-soft-gold/20 text-soft-gold rounded-full text-xs font-semibold border border-soft-gold/30">
                {albums.find((a: Album) => a._id === selectedAlbum)?.name}
              </span>
            )}
            {sortOrder !== "desc" && (
              <span className="px-3 py-1 bg-spirit-cyan/20 text-spirit-cyan rounded-full text-xs font-semibold border border-spirit-cyan/30">
                Cũ nhất trước
              </span>
            )}
          </div>
        )}
      </div>

      {products.length === 0 && pagination.total === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-spirit-cyan/20 text-center">
          <p className="text-muted-blue text-lg mb-6">
            {debouncedSearchQuery || selectedAlbum
              ? "Không có sản phẩm nào khớp với bộ lọc của bạn"
              : "Không tìm thấy sản phẩm"}
          </p>
          {!debouncedSearchQuery && !selectedAlbum && (
            <Link
              href="/studio/cms/products/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-cyan hover:opacity-90 text-midnight rounded-xl transition-all border border-spirit-cyan/20  font-medium"
            >
              <PlusOutlined />
              <span>Tạo sản phẩm đầu tiên</span>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <ProductCard
                key={product._id}
                product={product}
                albumName={getAlbumName(product.albumId)}
                imageUrl={getProductImage(product) || ""}
                onDelete={handleDelete}
                isDeleting={deleteProduct.isPending}
              />
            ))}
          </div>

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
                  `${range[0]}-${range[1]} trong tổng số ${total} mục`
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
