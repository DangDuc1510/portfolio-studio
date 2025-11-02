"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/app/studio-manage/cms/products/hooks/useProducts";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

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

  const isVideo = product.category === "Video" && product.videoUrl;
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
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeftOutlined />
        <span>Back to Portfolio</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image/Video Gallery */}
        <div className="space-y-4">
          {/* Main Video/Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#414141] to-[#2C2C2C] border border-white/10">
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
            ) : mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                {product.thumbnail && (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {!product.thumbnail && (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
            )}
          </div>

          {/* Thumbnail Strip - Only show if not video and has multiple images */}
          {!isVideo && images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-[#FFDD00]"
                      : "border-transparent hover:border-white/30"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Video Thumbnail Preview - If video but has thumbnail */}
          {/* {isVideo && product.thumbnail && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#414141] to-[#2C2C2C] border border-white/10">
              <img
                src={product.thumbnail}
                alt={`${product.name} thumbnail`}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-4">
                  <PlayCircleOutlined className="text-white text-4xl" />
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>
            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(
                  product.category
                )}`}
                className="inline-block px-4 py-2 bg-[#FFDD00] text-[#1C1C1C] font-semibold rounded-full hover:bg-[#FFED4E] transition-colors mb-4"
              >
                {product.category}
              </Link>
            )}
          </div>

          {product.description && (
            <div>
              <h2 className="text-white text-xl font-semibold mb-3">
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Video Info */}
          {/* {isVideo && product.videoUrl && (
            <div className="p-4 bg-[#2C2C2C]/50 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircleOutlined className="text-[#FFDD00] text-lg" />
                <span className="text-white font-semibold">Video Content</span>
              </div>
              <a
                href={product.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FFDD00] transition-colors text-sm break-all"
              >
                {product.videoUrl}
              </a>
            </div>
          )} */}

          {/* Share Button */}
          <div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
            >
              <ShareAltOutlined />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Related Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 6).map((relatedProduct) => {
              const imageUrl =
                relatedProduct.images?.[0] || relatedProduct.thumbnail;
              return (
                <Link
                  key={relatedProduct._id}
                  href={`/products/${relatedProduct._id}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#414141] to-[#2C2C2C] border border-white/10 hover:border-[#FFDD00]/50 transition-all"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-lg font-bold">
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
            className="absolute top-4 right-4 text-white text-2xl hover:text-[#FFDD00] transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            ✕
          </button>
          <img
            src={images[selectedImageIndex]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
