"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAlbums, Album } from "@/hooks/useAlbums";
import { useProducts, Product, ProductType } from "@/hooks/useProducts";
import Container from "@/components/Container";

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

// Background colors cho mỗi product type
const productTypeBackgrounds: Record<ProductType, string> = {
  QUAY_DUNG: "bg-hero-gradient-transparent3", // Màu navy cho Quay Dựng
  THIET_KE: "bg-hero-gradient-transparent7", // Màu moonlight cho Thiết Kế
  CHUP_CHINH_ANH: "bg-hero-gradient-transparent3", // Màu midnightLight cho Chụp - Chỉnh Ảnh
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
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Helper function to convert YouTube/Vimeo URL to embed URL
const convertToEmbedUrl = (url: string, platform?: string): string => {
  if (!url) return "";

  // Check if already embed URL
  if (url.includes("/embed/")) return url;

  // YouTube
  if (
    platform === "youtube" ||
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Vimeo
  if (platform === "vimeo" || url.includes("vimeo.com")) {
    const vimeoPattern = /(?:vimeo\.com\/)(\d+)/;
    const match = url.match(vimeoPattern);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  // If no pattern matches, return original URL
  return url;
};

// Helper component to handle both Next.js Image and regular img
const ProductImage = ({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={CAROUSEL_HEIGHT}
      className={className}
      style={style}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
};

// Carousel configuration - có thể tùy chỉnh
const CAROUSEL_HEIGHT = 400; // Height cố định của carousel (px)
const AUTO_PLAY_INTERVAL = 5000; // Thời gian auto play (ms)
const TRANSITION_DURATION = 1000; // Thời gian transition (ms)

// Helper function to calculate max-width from aspect ratio
const calculateMaxWidth = (
  aspectRatio: string | undefined,
  hasVideo: boolean
): number | undefined => {
  // Default to 16/9 for video if not specified
  const ratio = aspectRatio || (hasVideo ? "16/9" : undefined);
  if (!ratio) return undefined;

  // Parse aspect ratio string (e.g., "16/9" -> 16/9)
  const parts = ratio.split("/");
  if (parts.length !== 2) return undefined;

  const width = parseFloat(parts[0]);
  const height = parseFloat(parts[1]);
  if (isNaN(width) || isNaN(height) || height === 0) return undefined;

  // Calculate width based on CAROUSEL_HEIGHT
  return (CAROUSEL_HEIGHT * width) / height;
};

// Product Item Component với hover để hiển thị video
interface ProductItemProps {
  product: Product;
  imageUrl: string;
  displayThumbnail: string;
  hasVideo: boolean;
  videoData: {
    url: string;
    platform?: string;
    originalUrl?: string;
  } | null;
  itemRef: (el: HTMLDivElement | null) => void;
}

const ProductItem = ({
  product,
  imageUrl,
  displayThumbnail,
  hasVideo,
  videoData,
  itemRef,
}: ProductItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Video URL with autoplay (only when hovered)
  const videoUrlWithAutoplay = useMemo(() => {
    if (!videoData?.url || !isHovered) return "";
    const separator = videoData.url.includes("?") ? "&" : "?";
    return `${videoData.url}${separator}autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&playsinline=1&fs=0`;
  }, [videoData?.url, isHovered]);

  // Reset video loaded state when hover ends
  useEffect(() => {
    if (!isHovered) {
      setVideoLoaded(false);
    }
  }, [isHovered]);

  return (
    <div
      ref={itemRef}
      className="flex-shrink-0"
      style={{ width: "auto" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/san-pham/${product._id}`}
        className="block overflow-hidden relative group"
        style={{ width: "auto" }}
      >
        {hasVideo && videoData ? (
          <div className="relative w-auto overflow-hidden aspect-video">
            {/* Video Thumbnail - base layer, luôn render */}
            {displayThumbnail && displayThumbnail !== "/image.png" ? (
              <>
                <ProductImage
                  src={displayThumbnail}
                  alt={product.name}
                  className="w-full object-cover aspect-video"
                  style={{ height: `${CAROUSEL_HEIGHT}px` }}
                />
                {/* Thumbnail overlay với fade */}
                <div
                  className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${
                    isHovered && videoLoaded ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {/* Play Icon Overlay */}
                  {!isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              !isHovered && (
                <div className="w-full h-full flex items-center justify-center bg-midnight aspect-video min-w-[200px]">
                  <span className="text-muted-blue">Không có hình ảnh</span>
                </div>
              )
            )}

            {/* Video Player - overlay layer, chỉ hiện khi hover */}
            {isHovered && videoUrlWithAutoplay && (
              <div
                className={`absolute inset-0 transition-opacity duration-500 h-[${CAROUSEL_HEIGHT}px] aspect-video ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                <iframe
                  src={videoUrlWithAutoplay}
                  className="w-full h-full aspect-video"
                  style={{
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={product.name}
                  onLoad={() => setVideoLoaded(true)}
                />
              </div>
            )}
          </div>
        ) : imageUrl && imageUrl !== "/image.png" ? (
          <ProductImage
            src={displayThumbnail || imageUrl}
            alt={product.name}
            className="w-auto object-cover"
            style={{ height: `${CAROUSEL_HEIGHT}px` }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center bg-midnight"
            style={{
              height: `${CAROUSEL_HEIGHT}px`,
            }}
          >
            <span className="text-muted-blue">Không có hình ảnh</span>
          </div>
        )}

        {/* Product Info */}
        <div
          className="mt-3"
          style={{
            maxWidth: calculateMaxWidth(product.aspectRatio, hasVideo)
              ? `${calculateMaxWidth(product.aspectRatio, hasVideo)}px`
              : undefined,
          }}
        >
          <h4 className="text-pure-white font-semibold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-spirit-cyan transition-colors">
            {product.name}
          </h4>
          {product.description && (
            <p className="text-muted-blue text-xs sm:text-sm line-clamp-1 w-full">
              {product.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

// Auto Play Carousel Component
interface AutoPlayCarouselProps {
  products: Product[];
  getProductImage: (product: Product) => string;
}

function AutoPlayCarousel({
  products,
  getProductImage,
}: AutoPlayCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const styleId = useRef<string>(
    `carousel-${Math.random().toString(36).substr(2, 9)}`
  );

  // Hide scrollbar for webkit browsers
  useEffect(() => {
    const currentStyleId = styleId.current;
    const style = document.createElement("style");
    style.id = currentStyleId;
    style.textContent = `
      .${currentStyleId}::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById(currentStyleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Scroll to current index with custom duration
  useEffect(() => {
    if (itemRefs.current[currentIndex] && carouselRef.current) {
      const item = itemRefs.current[currentIndex];
      const container = carouselRef.current;

      const startScrollLeft = container.scrollLeft;
      const targetScrollLeft = item.offsetLeft - container.offsetLeft;
      const distance = targetScrollLeft - startScrollLeft;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / TRANSITION_DURATION, 1);

        // Easing function (ease-in-out)
        const easeInOut =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        container.scrollLeft = startScrollLeft + distance * easeInOut;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }, [currentIndex]);

  // Auto play functionality
  useEffect(() => {
    if (products.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [products.length, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handlePrevious = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setTimeout(() => setIsPaused(false), AUTO_PLAY_INTERVAL);
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => setIsPaused(false), AUTO_PLAY_INTERVAL);
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      {/* Previous Button */}
      {products.length > 3 && (
        <button
          onClick={handlePrevious}
          className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-midnight/80 hover:bg-midnight/90 border-2 border-spirit-cyan/30 hover:border-spirit-cyan/60 rounded-full p-3 transition-all hover:scale-110 shadow-lg backdrop-blur-sm"
          style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-spirit-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {products.length > 3 && (
        <button
          onClick={handleNext}
          className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-midnight/80 hover:bg-midnight/90 border-2 border-spirit-cyan/30 hover:border-spirit-cyan/60 rounded-full p-3 transition-all hover:scale-110 shadow-lg backdrop-blur-sm"
          style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-spirit-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      <div
        ref={carouselRef}
        className={`relative overflow-x-auto overflow-y-hidden ${styleId.current}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex gap-4"
          style={{
            width: "max-content",
          }}
        >
          {products.map((product: Product, index: number) => {
            const imageUrl = getProductImage(product);

            // Check if this is a QUAY DỰNG product with video
            const isQuayDung = product.productType === "QUAY_DUNG";
            const hasVideo = Boolean(
              isQuayDung &&
                ((product.platformLinks && product.platformLinks.length > 0) ||
                  product.videoUrl)
            );

            // Get video URL and platform
            let videoData = null;
            if (hasVideo) {
              // Prefer platformLinks over videoUrl
              if (product.platformLinks && product.platformLinks.length > 0) {
                const firstLink = product.platformLinks[0];
                videoData = {
                  url: convertToEmbedUrl(firstLink.url, firstLink.platform),
                  platform: firstLink.platform,
                  originalUrl: firstLink.url,
                };
              } else if (product.videoUrl) {
                videoData = {
                  url: convertToEmbedUrl(product.videoUrl),
                  platform: undefined,
                  originalUrl: product.videoUrl,
                };
              }
            }

            // Get YouTube thumbnail if available
            let youtubeThumbnail = null;
            if (isQuayDung && videoData) {
              // Check if it's YouTube
              if (
                videoData.platform === "youtube" ||
                videoData.originalUrl?.includes("youtube.com") ||
                videoData.originalUrl?.includes("youtu.be")
              ) {
                const videoId = extractYouTubeVideoId(
                  videoData.originalUrl || ""
                );
                if (videoId) {
                  youtubeThumbnail = getYouTubeThumbnail(videoId);
                }
              }
            }

            // Determine which thumbnail/image to show
            const displayThumbnail = youtubeThumbnail || imageUrl;

            return (
              <ProductItem
                key={product._id}
                product={product}
                imageUrl={imageUrl}
                displayThumbnail={displayThumbnail}
                hasVideo={hasVideo}
                videoData={videoData}
                itemRef={(el) => {
                  itemRefs.current[index] = el;
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
    <div className="space-y-0">
      {productTypes.map((productType) => {
        const typeData = featuredProductsByType[productType];
        if (!typeData || !typeData.albumIds || typeData.albumIds.length === 0) {
          return null;
        }

        return (
          <section
            key={productType}
            className={`py-20 ${productTypeBackgrounds[productType]}`}
          >
            <Container>
              {/* Product Type Header */}
              <div className="mb-16 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pure-white mb-4 drop-shadow-lg">
                  {productTypeLabels[productType]}
                </h2>
                <div className="w-24 h-1 bg-spirit-cyan mx-auto"></div>
              </div>

              {/* Albums */}
              <div className="space-y-6">
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
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg sm:text-xl text-pure-white">
                          {album.name}
                        </h3>
                        <Link
                          href={
                            productType === "QUAY_DUNG"
                              ? "/quay-dung"
                              : productType === "THIET_KE"
                                ? "/thiet-ke"
                                : "/chup-chinh-anh"
                          }
                          className="text-spirit-cyan hover:text-secondary-cyan transition-colors text-sm"
                        >
                          Xem tất cả →
                        </Link>
                      </div>

                      {/* Products Carousel */}
                      <AutoPlayCarousel
                        products={products}
                        getProductImage={getProductImage}
                      />
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
