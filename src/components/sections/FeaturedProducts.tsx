"use client";

import Link from "next/link";
import { Product } from "@/app/studio-manage/cms/products/hooks/useProducts";
import { EyeOutlined } from "@ant-design/icons";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function FeaturedProducts({
  products,
  title = "Featured Works",
  subtitle,
  limit = 6,
}: FeaturedProductsProps) {
  const featuredProducts = products.slice(0, limit);

  if (featuredProducts.length === 0) return null;

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.thumbnail) {
      return product.thumbnail;
    }
    return null;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#343434] to-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredProducts.map((product) => {
            const imageUrl = getProductImage(product);
            return (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#414141] to-[#2C2C2C] border border-white/10 hover:border-[#FFDD00]/50 transition-all"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl font-bold mb-2">
                    {product.name}
                  </h3>
                  {product.category && (
                    <span className="inline-block px-3 py-1 bg-[#FFDD00] text-[#1C1C1C] text-xs font-semibold rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* View Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <EyeOutlined className="text-white text-lg" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        {products.length > limit && (
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-[#FFDD00] to-[#FFED4E] text-[#1C1C1C] font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              View All Works
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

