"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Product, ProductType, PlatformLink } from "@/hooks/useProducts";

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
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  // Check if it's an external URL
  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
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
      height={225}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
};

interface ProductCardProps {
  product: Product;
  albumName: string | null;
  imageUrl: string;
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

export default function ProductCard({
  product,
  albumName,
  imageUrl,
  onDelete,
  isDeleting,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Check if this is a QUAY DỰNG product with video
  const isQuayDung = product.productType === "QUAY_DUNG";
  const hasVideo =
    isQuayDung &&
    ((product.platformLinks && product.platformLinks.length > 0) ||
      product.videoUrl);

  // Get video URL and platform
  const videoData = useMemo(() => {
    if (!hasVideo) return null;

    // Prefer platformLinks over videoUrl
    if (product.platformLinks && product.platformLinks.length > 0) {
      const firstLink = product.platformLinks[0];
      return {
        url: convertToEmbedUrl(firstLink.url, firstLink.platform),
        platform: firstLink.platform,
        originalUrl: firstLink.url,
      };
    }

    if (product.videoUrl) {
      return {
        url: convertToEmbedUrl(product.videoUrl),
        platform: undefined,
        originalUrl: product.videoUrl,
      };
    }

    return null;
  }, [product.platformLinks, product.videoUrl, hasVideo]);

  // Get YouTube thumbnail if available
  const youtubeThumbnail = useMemo(() => {
    if (!isQuayDung || !videoData) return null;

    // Check if it's YouTube
    if (
      videoData.platform === "youtube" ||
      videoData.originalUrl?.includes("youtube.com") ||
      videoData.originalUrl?.includes("youtu.be")
    ) {
      const videoId = extractYouTubeVideoId(videoData.originalUrl || "");
      if (videoId) {
        return getYouTubeThumbnail(videoId);
      }
    }

    return null;
  }, [isQuayDung, videoData]);

  // Determine which thumbnail/image to show
  // Prefer YouTube thumbnail if available (even if imageUrl exists, YouTube thumbnail is usually better quality)
  const displayThumbnail = useMemo(() => {
    // For QUAY DỰNG with YouTube, prefer YouTube thumbnail
    if (youtubeThumbnail) {
      return youtubeThumbnail;
    }
    // Fallback to provided imageUrl (which may already be YouTube thumbnail from page.tsx)
    return imageUrl;
  }, [youtubeThumbnail, imageUrl]);

  // Add autoplay parameter when hovered
  const videoUrlWithAutoplay = useMemo(() => {
    if (!videoData?.url) return "";
    const separator = videoData.url.includes("?") ? "&" : "?";
    return isHovered
      ? `${videoData.url}${separator}autoplay=1&mute=1&loop=1&controls=0&modestbranding=1`
      : videoData.url;
  }, [videoData?.url, isHovered]);

  return (
    <div
      className="glass-card rounded-lg overflow-hidden hover-lift border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasVideo && videoData ? (
        <div className="bg-gradient-to-br from-spirit-cyan/30 via-mystic/25 to-soft-gold/20 aspect-video flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-spirit-cyan/15 via-mystic/15 to-soft-gold/10 group-hover:from-spirit-cyan/25 group-hover:via-mystic/25 group-hover:to-soft-gold/15 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,209,255,0.1)_0%,_transparent_70%)]"></div>

          {/* Video Thumbnail (shown when not hovered) */}
          {!isHovered && displayThumbnail && (
            <ProductImage
              src={displayThumbnail}
              alt={product.name}
              className="w-full h-full object-cover relative z-10 transition-opacity duration-300"
            />
          )}

          {/* Video Player (shown when hovered) */}
          {isHovered && (
            <iframe
              src={videoUrlWithAutoplay}
              className="w-full h-full object-cover relative z-20"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={product.name}
              style={{ border: "none" }}
            />
          )}

          {/* Play Icon Overlay */}
          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 group-hover:bg-black/10 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
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
      ) : imageUrl ? (
        <div className="bg-gradient-to-br from-spirit-cyan/30 via-mystic/25 to-soft-gold/20 aspect-video flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-spirit-cyan/15 via-mystic/15 to-soft-gold/10 group-hover:from-spirit-cyan/25 group-hover:via-mystic/25 group-hover:to-soft-gold/15 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(79,209,255,0.1)_0%,_transparent_70%)]"></div>
          <ProductImage
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : null}
      <div className="p-6">
        <h3 className="text-pure-white text-xl font-bold mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-blue mb-4 text-sm line-clamp-2">
          {product.description || "Không có mô tả"}
        </p>
        {(product.createdAt || product.updatedAt) && (
          <div className="text-xs text-muted-blue mb-4 space-y-1">
            {product.createdAt && (
              <div>
                Tạo: {new Date(product.createdAt).toLocaleDateString("vi-VN")}{" "}
                {new Date(product.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
            {product.updatedAt && (
              <div>
                Cập nhật:{" "}
                {new Date(product.updatedAt).toLocaleDateString("vi-VN")}{" "}
                {new Date(product.updatedAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-golden text-midnight px-3 py-1 rounded-full text-xs font-semibold">
            {product.productType === "QUAY_DUNG"
              ? "QUAY DỰNG"
              : product.productType === "THIET_KE"
              ? "THIẾT KẾ"
              : "CHỤP - CHỈNH ẢNH"}
          </span>
          {albumName && (
            <span className="bg-mystic text-pure-white px-3 py-1 rounded-full text-xs font-semibold">
              Dự án: {albumName}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/studio/cms/products/edit/${product._id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary-cyan hover:opacity-90 text-midnight rounded-lg transition-all border border-spirit-cyan/20 font-medium"
          >
            <EditOutlined />
            <span>Chỉnh sửa</span>
          </Link>
          <button
            onClick={() => onDelete(product._id, product.name)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-error/20 text-error hover:text-error-light rounded-lg transition-all border border-error/30 hover:border-error/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DeleteOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}
