"use client";
import { useState, useMemo } from "react";
import { Input, Select } from "antd";
import { useAlbums, Album } from "@/hooks/useAlbums";
import { useProducts, ProductType } from "@/hooks/useProducts";
import { DownOutlined } from "@ant-design/icons";

interface FeaturedContentSectionFormProps {
  content: Record<string, unknown>;
  updateContent: (key: string, value: unknown) => void;
}

const getStringValue = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const productTypeLabels: Record<ProductType, string> = {
  QUAY_DUNG: "QUAY DỰNG",
  THIET_KE: "THIẾT KẾ",
  CHUP_CHINH_ANH: "CHỤP - CHỈNH ẢNH",
};

export default function FeaturedContentSectionForm({
  content,
  updateContent,
}: FeaturedContentSectionFormProps) {
  const { data: albumsData } = useAlbums();
  const albums = albumsData || [];

  // Fetch all products for all types
  const { data: quayDungData } = useProducts({
    productType: "QUAY_DUNG",
    limit: 1000,
  });
  const { data: thietKeData } = useProducts({
    productType: "THIET_KE",
    limit: 1000,
  });
  const { data: chupChinhAnhData } = useProducts({
    productType: "CHUP_CHINH_ANH",
    limit: 1000,
  });

  const allProducts = useMemo(() => {
    return {
      QUAY_DUNG: quayDungData?.data || [],
      THIET_KE: thietKeData?.data || [],
      CHUP_CHINH_ANH: chupChinhAnhData?.data || [],
    };
  }, [quayDungData, thietKeData, chupChinhAnhData]);

  const [expandedAlbums, setExpandedAlbums] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // Type definition for featured products structure
  type FeaturedProductsByType = Record<
    ProductType,
    {
      albumIds?: string[];
      productsByAlbum?: Record<string, string[]>;
    }
  >;

  // Get featured products structure from content
  const getFeaturedProductsByType = (): FeaturedProductsByType => {
    const featuredProducts = content.featuredProductsByType as
      | FeaturedProductsByType
      | undefined;
    return (
      featuredProducts || {
        QUAY_DUNG: {},
        THIET_KE: {},
        CHUP_CHINH_ANH: {},
      }
    );
  };

  const featuredProductsByType = getFeaturedProductsByType();

  // Get albums filtered by product type
  const getAlbumsByProductType = (productType: ProductType) => {
    const products = allProducts[productType];
    const albumIds = new Set(
      products
        .map((p: { albumId?: string }) => p.albumId)
        .filter((id: string | undefined): id is string => !!id)
    );
    return albums.filter((album: Album) => albumIds.has(album._id));
  };

  // Get products for a specific album
  const getProductsByAlbum = (albumId: string, productType: ProductType) => {
    const products = allProducts[productType];
    return products.filter((p: { albumId?: string }) => p.albumId === albumId);
  };

  // Update album selection for a product type
  const updateAlbumSelection = (
    productType: ProductType,
    albumIds: string[]
  ) => {
    const updated = {
      ...featuredProductsByType,
      [productType]: {
        ...featuredProductsByType[productType],
        albumIds,
        // Remove productsByAlbum entries for unselected albums
        productsByAlbum: Object.fromEntries(
          Object.entries(
            featuredProductsByType[productType]?.productsByAlbum || {}
          ).filter(([albumId]) => albumIds.includes(albumId))
        ),
      },
    };
    updateContent("featuredProductsByType", updated);
  };

  // Update product selection for a specific album
  const updateProductSelection = (
    productType: ProductType,
    albumId: string,
    productIds: string[]
  ) => {
    const updated = {
      ...featuredProductsByType,
      [productType]: {
        ...featuredProductsByType[productType],
        albumIds: featuredProductsByType[productType]?.albumIds || [],
        productsByAlbum: {
          ...featuredProductsByType[productType]?.productsByAlbum,
          [albumId]: productIds,
        },
      },
    };
    updateContent("featuredProductsByType", updated);
  };

  // Toggle album expansion
  const toggleAlbumExpansion = (productType: ProductType, albumId: string) => {
    setExpandedAlbums((prev) => ({
      ...prev,
      [productType]: {
        ...prev[productType],
        [albumId]: !prev[productType]?.[albumId],
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Video Background Section */}
      <div className="border border-spirit-cyan/20 rounded-xl p-4 bg-moonlight/30">
        <h4 className="text-ice-white font-semibold mb-4">Video Background</h4>
        <div>
          <label className="block text-ice-white text-sm font-medium mb-2">
            Video URL
          </label>
          <Input
            value={getStringValue(content.videoUrl)}
            onChange={(e) => updateContent("videoUrl", e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="bg-moonlight border-spirit-cyan/20 text-ice-white"
          />
          <p className="text-muted-blue text-xs mt-1">
            URL của video sẽ được sử dụng làm background
          </p>
        </div>
      </div>

      {/* Featured Products by Type Section */}
      <div className="border border-spirit-cyan/20 rounded-xl p-4 bg-moonlight/30">
        <h4 className="text-ice-white font-semibold mb-4">
          Chọn Sản Phẩm Nổi Bật
        </h4>
        <p className="text-muted-blue text-sm mb-4">
          Chọn các album và sản phẩm theo từng loại để hiển thị trên trang chủ
        </p>

        <div className="space-y-6">
          {(["QUAY_DUNG", "THIET_KE", "CHUP_CHINH_ANH"] as ProductType[]).map(
            (productType) => {
              const typeAlbums = getAlbumsByProductType(productType);
              const selectedAlbumIds =
                featuredProductsByType[productType]?.albumIds || [];

              return (
                <div
                  key={productType}
                  className="border border-spirit-cyan/10 rounded-lg p-4 bg-midnight/50"
                >
                  <h5 className="text-ice-white font-semibold mb-3 text-lg">
                    {productTypeLabels[productType]}
                  </h5>

                  {/* Album Selection */}
                  <div className="mb-4">
                    <label className="block text-ice-white text-sm font-medium mb-2">
                      Chọn Albums (Dự án)
                    </label>
                    <Select
                      mode="multiple"
                      value={selectedAlbumIds}
                      onChange={(value) =>
                        updateAlbumSelection(productType, value)
                      }
                      placeholder="Chọn các album để hiển thị"
                      className="w-full"
                      options={typeAlbums.map((album: Album) => ({
                        label: album.name,
                        value: album._id,
                      }))}
                    />
                  </div>

                  {/* Products Selection for each Album */}
                  {selectedAlbumIds.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <label className="block text-ice-white text-sm font-medium mb-2">
                        Chọn sản phẩm cụ thể (tùy chọn - để trống sẽ hiển thị
                        tất cả)
                      </label>
                      {selectedAlbumIds.map((albumId: string) => {
                        const album = albums.find(
                          (a: Album) => a._id === albumId
                        );
                        if (!album) return null;

                        const albumProducts = getProductsByAlbum(
                          albumId,
                          productType
                        );
                        const selectedProductIds =
                          featuredProductsByType[productType]
                            ?.productsByAlbum?.[albumId] || [];
                        const isExpanded =
                          expandedAlbums[productType]?.[albumId] || false;

                        return (
                          <div
                            key={albumId}
                            className="border border-spirit-cyan/10 rounded-lg p-3 bg-moonlight/30"
                          >
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() =>
                                toggleAlbumExpansion(productType, albumId)
                              }
                            >
                              <span className="text-ice-white font-medium">
                                {album.name}
                              </span>
                              <DownOutlined
                                className={`text-spirit-cyan transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </div>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-spirit-cyan/10">
                                <Select
                                  mode="multiple"
                                  value={selectedProductIds}
                                  onChange={(value) =>
                                    updateProductSelection(
                                      productType,
                                      albumId,
                                      value
                                    )
                                  }
                                  placeholder={`Chọn sản phẩm trong ${album.name} (để trống = tất cả)`}
                                  className="w-full"
                                  options={albumProducts.map(
                                    (product: {
                                      _id: string;
                                      name: string;
                                    }) => ({
                                      label: product.name,
                                      value: product._id,
                                    })
                                  )}
                                />
                                <p className="text-muted-blue text-xs mt-2">
                                  Đã chọn {selectedProductIds.length} /{" "}
                                  {albumProducts.length} sản phẩm. Để trống sẽ
                                  hiển thị tất cả sản phẩm trong album này.
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
