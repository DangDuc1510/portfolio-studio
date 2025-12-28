"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { Product } from "@/hooks/useProducts";

interface ProductsPhotoGalleryProps {
  products: Product[];
}

const GALLERY_HEIGHT = 200; // Height cố định (px)

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

  // Calculate width based on GALLERY_HEIGHT
  return (GALLERY_HEIGHT * width) / height;
};

// Helper function to get product image
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
      height={GALLERY_HEIGHT}
      className={className}
      style={style}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
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
}

const ProductItem = ({
  product,
  imageUrl,
  displayThumbnail,
  hasVideo,
  videoData,
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
                  style={{ height: `${GALLERY_HEIGHT}px` }}
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
                className={`absolute inset-0 transition-opacity duration-500 aspect-video ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ height: `${GALLERY_HEIGHT}px` }}
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
            style={{ height: `${GALLERY_HEIGHT}px` }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center bg-midnight"
            style={{
              height: `${GALLERY_HEIGHT}px`,
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

export default function ProductsPhotoGallery({
  products,
}: ProductsPhotoGalleryProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center py-20">
            <p className="text-xl text-muted-blue">
              Không tìm thấy sản phẩm nào
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="pb-20 pt-8">
      <Container>
        <div className="flex flex-wrap gap-4">
          {products.map((product) => {
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
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
