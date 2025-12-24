"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, ProductType } from "@/hooks/useProducts";
import { ArrowLeftOutlined, ShareAltOutlined } from "@ant-design/icons";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

// Helper function to convert YouTube URL to embed URL
const convertToEmbedUrl = (url: string): string => {
  if (!url) return "";

  // Check if already embed URL
  if (url.includes("/embed/")) return url;

  // Extract video ID from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // If no pattern matches, return original URL
  return url;
};

export default function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = product.images || [];
  const mainImage =
    images.length > 0 ? images[selectedImageIndex] : product.thumbnail;

  const isVideo = product.productType === "QUAY_DUNG" && product.videoUrl;
  const embedVideoUrl = useMemo(() => {
    if (!product.videoUrl) return "";
    return convertToEmbedUrl(product.videoUrl);
  }, [product.videoUrl]);

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

  const mainImageUrl = mainImage ? getImageUrl(mainImage) : "/image.png";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/san-pham"
        className="inline-flex items-center gap-2 text-muted-blue hover:text-spirit-cyan mb-8 transition-colors"
      >
        <ArrowLeftOutlined />
        <span>Quay lại danh mục</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image/Video Gallery */}
        <div className="space-y-4">
          {/* Main Video/Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card border border-spirit-cyan/20">
            {isVideo && embedVideoUrl ? (
              <div className="w-full h-full">
                <iframe
                  src={embedVideoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={product.name}
                />
              </div>
            ) : mainImageUrl && mainImageUrl !== "/image.png" ? (
              isExternalImage(mainImageUrl) ? (
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />
              ) : (
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-midnight">
                <span className="text-muted-blue">Không có hình ảnh</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip - Only show if not video and has multiple images */}
          {!isVideo && images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => {
                const thumbUrl = getImageUrl(image);
                const isExternal = isExternalImage(thumbUrl);
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-spirit-cyan"
                        : "border-transparent hover:border-spirit-cyan/40"
                    }`}
                  >
                    {isExternal ? (
                      <img
                        src={thumbUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={thumbUrl}
                        alt={`${product.name} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
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
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-pure-white mb-8">
            Tác phẩm liên quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 6).map((relatedProduct) => {
              const imageUrl =
                relatedProduct.images?.[0] || relatedProduct.thumbnail;
              const relatedImageUrl = imageUrl ? getImageUrl(imageUrl) : "/image.png";
              const isExternal = isExternalImage(relatedImageUrl);
              return (
                <Link
                  key={relatedProduct._id}
                  href={`/san-pham/${relatedProduct._id}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden glass-card border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all hover-lift"
                >
                  {relatedImageUrl && relatedImageUrl !== "/image.png" ? (
                    isExternal ? (
                      <img
                        src={relatedImageUrl}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Image
                        src={relatedImageUrl}
                        alt={relatedProduct.name}
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
                    <h3 className="text-pure-white text-lg font-bold">
                      {relatedProduct.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-ice-white text-2xl hover:text-spirit-cyan transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            ✕
          </button>
          {isExternalImage(images[selectedImageIndex]) ? (
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Image
              src={images[selectedImageIndex]}
              alt={product.name}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}

