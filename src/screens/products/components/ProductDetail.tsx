"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, PlatformLink } from "@/hooks/useProducts";
import { ArrowLeftOutlined, ShareAltOutlined } from "@ant-design/icons";
import Container from "@/components/Container";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

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

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Carousel configuration
const CAROUSEL_HEIGHT = 200; // Height cố định của carousel (px)
const AUTO_PLAY_INTERVAL = 5000; // Thời gian auto play (ms)
const TRANSITION_DURATION = 1000; // Thời gian transition (ms)

const getImageUrl = (imageUrl: string | undefined): string => {
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

const isExternalImage = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

// Helper component to handle both Next.js Image and regular img
const ProductImage = ({
  src,
  alt,
  className,
  style,
  onClick,
  useFill = false,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent) => void;
  useFill?: boolean;
}) => {
  const isExternal = isExternalImage(src);

  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onClick={onClick}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  if (useFill) {
    return (
      <div className="relative" style={style}>
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          onClick={onClick}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      className={className}
      style={style}
      onClick={onClick}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
};

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

const getPlatformInfo = (platform: string) => {
  switch (platform) {
    case "youtube":
      return {
        name: "YouTube",
        icon: (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        ),
      };
    case "vimeo":
      return {
        name: "Vimeo",
        icon: (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.011 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128 1.572-1.37 2.752-2.092 3.538-2.165 1.866-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
          </svg>
        ),
      };
    default:
      return {
        name: "Xem video",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      };
  }
};

// Product Item Component với hover để hiển thị video (cho carousel)
interface CarouselProductItemProps {
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

const CarouselProductItem = ({
  product,
  imageUrl,
  displayThumbnail,
  hasVideo,
  videoData,
  itemRef,
}: CarouselProductItemProps) => {
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
                className={`absolute inset-0 transition-opacity duration-500 aspect-video ${
                  videoLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ height: `${CAROUSEL_HEIGHT}px` }}
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
function AutoPlayCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const styleId = useRef<string>(
    `carousel-${Math.random().toString(36).substr(2, 9)}`
  );

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
              <CarouselProductItem
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

export default function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = product.images || [];
  const mainImage =
    images.length > 0 ? images[selectedImageIndex] : product.thumbnail;

  // Check if product has video (QUAY_DUNG with videoUrl or platformLinks)
  const isVideo =
    product.productType === "QUAY_DUNG" &&
    (product.videoUrl ||
      (product.platformLinks && product.platformLinks.length > 0));

  // Get video data from platformLinks or videoUrl
  const videoData = useMemo(() => {
    if (!isVideo) return null;

    // Prefer platformLinks over videoUrl
    if (product.platformLinks && product.platformLinks.length > 0) {
      const firstLink = product.platformLinks[0];
      return {
        url: convertToEmbedUrl(firstLink.url, firstLink.platform),
        platform: firstLink.platform,
        originalUrl: firstLink.url,
        platformLinks: product.platformLinks,
      };
    } else if (product.videoUrl) {
      return {
        url: convertToEmbedUrl(product.videoUrl),
        platform: undefined,
        originalUrl: product.videoUrl,
        platformLinks: [],
      };
    }

    return null;
  }, [product, isVideo]);

  const embedVideoUrl = videoData?.url || "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link vào clipboard!");
    }
  };

  const mainImageUrl = mainImage ? getImageUrl(mainImage) : "/image.png";

  return (
    <>
      {/* Back Button */}
      <Container className="pt-8 pb-4 space-y-4">
        <Link
          href={
            product.productType === "QUAY_DUNG"
              ? "/quay-dung"
              : product.productType === "THIET_KE"
              ? "/thiet-ke"
              : "/chup-chinh-anh"
          }
          className="inline-flex items-center gap-2 text-muted-blue hover:text-spirit-cyan transition-colors"
        >
          <ArrowLeftOutlined />
          <span>Quay lại danh mục</span>
        </Link>
        <section className="w-full mb-12">
          {/* Main Image/Video Display */}
          <div className="relative w-full" style={{ minHeight: "60vh" }}>
            {isVideo && embedVideoUrl ? (
              <div className="relative w-full aspect-video bg-midnight">
                <iframe
                  src={embedVideoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={product.name}
                />
              </div>
            ) : mainImageUrl && mainImageUrl !== "/image.png" ? (
              <div
                className="relative w-full flex items-center justify-center bg-midnight"
                style={{ minHeight: "60vh" }}
              >
                {isExternalImage(mainImageUrl) ? (
                  <img
                    src={mainImageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain cursor-pointer"
                    style={{ minHeight: "60vh" }}
                    onClick={() => setIsLightboxOpen(true)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Image
                    src={mainImageUrl}
                    alt={product.name}
                    width={1920}
                    height={1080}
                    className="w-full h-auto max-h-[80vh] object-contain cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            ) : (
              <div
                className="w-full flex items-center justify-center bg-midnight"
                style={{ minHeight: "60vh" }}
              >
                <span className="text-muted-blue">Không có hình ảnh</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip - Only show if has multiple images */}
          {!isVideo && images.length > 1 && (
            <Container className="mt-6">
              <div
                className="flex gap-4 overflow-x-auto pb-4"
                style={{ scrollbarWidth: "thin" }}
              >
                {images.map((image, index) => {
                  const thumbUrl = getImageUrl(image);
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-spirit-cyan scale-105"
                          : "border-transparent hover:border-spirit-cyan/40 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <ProductImage
                        src={thumbUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        useFill={true}
                      />
                    </button>
                  );
                })}
              </div>
            </Container>
          )}

          {/* Platform Links - Show if video and has platformLinks */}
          {isVideo &&
            videoData?.platformLinks &&
            videoData.platformLinks.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {videoData.platformLinks.map(
                    (link: PlatformLink, index: number) => {
                      const platformInfo = getPlatformInfo(link.platform);
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-spirit-cyan/30 text-ice-white rounded-xl hover:bg-spirit-cyan/10 hover:border-spirit-cyan transition-all"
                        >
                          {platformInfo.icon}
                          <span>Truy cập {platformInfo.name}</span>
                        </a>
                      );
                    }
                  )}
                </div>
            )}
        </section>
      </Container>

      {/* Full Width Gallery Section */}

      {/* Product Info Section */}
      <Container className="pb-12">
        <div className="space-y-8">
          {/* Title and Badge */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-pure-white mb-4">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-4 py-2 bg-golden text-midnight font-semibold rounded-full">
                {product.productType === "QUAY_DUNG"
                  ? "QUAY DỰNG"
                  : product.productType === "THIET_KE"
                  ? "THIẾT KẾ"
                  : "CHỤP - CHỈNH ẢNH"}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-pure-white text-xl font-semibold mb-3">
                Mô tả
              </h2>
              <p className="text-muted-blue leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Additional Info based on product type */}
          {product.productType === "QUAY_DUNG" && (
            <>
              {product.categoryText && (
                <div>
                  <h2 className="text-pure-white text-xl font-semibold mb-3">
                    Thể loại
                  </h2>
                  <p className="text-muted-blue leading-relaxed whitespace-pre-line">
                    {product.categoryText}
                  </p>
                </div>
              )}
              {product.location && (
                <div>
                  <h2 className="text-pure-white text-xl font-semibold mb-3">
                    Địa điểm
                  </h2>
                  <p className="text-muted-blue">{product.location}</p>
                </div>
              )}
            </>
          )}

          {product.productType === "THIET_KE" && (
            <>
              {product.designType && (
                <div>
                  <h2 className="text-pure-white text-xl font-semibold mb-3">
                    Loại thiết kế
                  </h2>
                  <p className="text-muted-blue">{product.designType}</p>
                </div>
              )}
              {product.toolsUsed && product.toolsUsed.length > 0 && (
                <div>
                  <h2 className="text-pure-white text-xl font-semibold mb-3">
                    Công cụ sử dụng
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.toolsUsed.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-spirit-cyan/20 text-spirit-cyan rounded-full text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {product.productType === "CHUP_CHINH_ANH" &&
            product.photographyType && (
              <div>
                <h2 className="text-pure-white text-xl font-semibold mb-3">
                  Loại nhiếp ảnh
                </h2>
                <p className="text-muted-blue">{product.photographyType}</p>
              </div>
            )}

          {/* Share Button */}
          <div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-spirit-cyan/20 text-ice-white rounded-xl hover:bg-moonlight-light transition-all"
            >
              <ShareAltOutlined />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </Container>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-section-gradient">
          <Container>
            <h2 className="text-3xl font-bold text-pure-white mb-8">
              Nội dung liên quan
            </h2>
            <AutoPlayCarousel products={relatedProducts.slice(0, 6)} />
          </Container>
        </section>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-ice-white text-2xl hover:text-spirit-cyan transition-colors z-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            ✕
          </button>
          <div className="relative max-w-7xl max-h-full">
            <ProductImage
              src={getImageUrl(images[selectedImageIndex])}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e?.stopPropagation()}
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ice-white text-4xl hover:text-spirit-cyan transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(
                    (prev) => (prev - 1 + images.length) % images.length
                  );
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ice-white text-4xl hover:text-spirit-cyan transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev + 1) % images.length);
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
