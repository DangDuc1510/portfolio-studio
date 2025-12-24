"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAlbums, Album } from "@/hooks/useAlbums";
import { useProducts, Product, ProductType } from "@/hooks/useProducts";

type FeaturedProductsByType = Record<
  ProductType,
  {
    albumIds?: string[];
    productsByAlbum?: Record<string, string[]>;
  }
>;

interface FeaturedContentSectionProps {
  content?: {
    videoUrl?: string;
    featuredProductsByType?: FeaturedProductsByType;
  };
}

const productTypeLabels: Record<ProductType, string> = {
  QUAY_DUNG: "QUAY DỰNG",
  THIET_KE: "THIẾT KẾ",
  CHUP_CHINH_ANH: "CHỤP - CHỈNH ẢNH",
};

const getProductImage = (product: Product): string => {
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }
  if (product.thumbnail) {
    return product.thumbnail;
  }
  return "/image.png";
};

const isExternalImage = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

export default function FeaturedContentSection({
  content,
}: FeaturedContentSectionProps) {
  const { data: albumsData } = useAlbums();
  const albums = albumsData || [];

  const featuredProductsByType: FeaturedProductsByType =
    content?.featuredProductsByType || {
      QUAY_DUNG: {},
      THIET_KE: {},
      CHUP_CHINH_ANH: {},
    };

  // Fetch products for each product type
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

  const allProducts = useMemo<Record<ProductType, Product[]>>(() => {
    return {
      QUAY_DUNG: quayDungData?.data || [],
      THIET_KE: thietKeData?.data || [],
      CHUP_CHINH_ANH: chupChinhAnhData?.data || [],
    };
  }, [quayDungData, thietKeData, chupChinhAnhData]);

  // Get products for a specific album and product type
  const getProductsForAlbum = (
    albumId: string,
    productType: ProductType,
    selectedProductIds?: string[]
  ): Product[] => {
    const products = allProducts[productType] || [];
    const albumProducts = products.filter(
      (p: Product) => p.albumId === albumId
    );

    // If specific products are selected, return only those
    if (selectedProductIds && selectedProductIds.length > 0) {
      return albumProducts.filter((p: Product) =>
        selectedProductIds.includes(p._id)
      );
    }

    // Otherwise return all products in the album
    return albumProducts;
  };

  const productTypes: ProductType[] = [
    "QUAY_DUNG",
    "THIET_KE",
    "CHUP_CHINH_ANH",
  ];

  return (
    <div className="space-y-20 py-20">
      {productTypes.map((productType) => {
        const typeData = featuredProductsByType[productType];
        if (!typeData || !typeData.albumIds || typeData.albumIds.length === 0) {
          return null;
        }

        return (
          <section key={productType} className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              {/* Product Type Header */}
              <div className="mb-12 text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-pure-white mb-4 drop-shadow-lg">
                  {productTypeLabels[productType]}
                </h2>
                <div className="w-24 h-1 bg-spirit-cyan mx-auto"></div>
              </div>

              {/* Albums */}
              <div className="space-y-16">
                {typeData.albumIds.map((albumId: string) => {
                  const album = albums.find((a: Album) => a._id === albumId);
                  if (!album) return null;

                  const selectedProductIds =
                    typeData.productsByAlbum?.[albumId];
                  const products = getProductsForAlbum(
                    albumId,
                    productType,
                    selectedProductIds
                  );

                  if (products.length === 0) return null;

                  return (
                    <div key={albumId} className="space-y-6">
                      {/* Album Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl sm:text-3xl font-bold text-pure-white">
                          {album.name}
                        </h3>
                        <Link
                          href={`/san-pham?productType=${productType}&albumId=${albumId}`}
                          className="text-spirit-cyan hover:text-secondary-cyan transition-colors text-sm font-medium"
                        >
                          Xem tất cả →
                        </Link>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product: Product) => {
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
                                  <span className="text-muted-blue">
                                    Không có hình ảnh
                                  </span>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <h4 className="text-pure-white font-semibold text-lg mb-2">
                                  {product.name}
                                </h4>
                                {product.description && (
                                  <p className="text-ice-white text-sm line-clamp-2">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
