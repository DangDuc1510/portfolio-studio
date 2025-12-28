"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import PhotoAlbum, {
  RenderImageProps,
  RenderImageContext,
} from "react-photo-album";
import "react-photo-album/styles.css";
import Container from "@/components/Container";

interface Product {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  thumbnail?: string;
  aspectRatio?: string;
}

interface ProductsPhotoGalleryProps {
  products: Product[];
}

interface PhotoWithProductId {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  productId: string;
}

// Custom render function for Next.js Image
function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext
) {
  const photoWithId = photo as PhotoWithProductId;
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
      className="group"
    >
      <Image
        fill
        src={photoWithId.src}
        alt={alt}
        title={title}
        sizes={sizes}
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-lg font-bold text-pure-white">{title || alt}</h3>
      </div>
    </div>
  );
}

export default function ProductsPhotoGallery({
  products,
}: ProductsPhotoGalleryProps) {
  const photos = useMemo(() => {
    return products.map((product) => {
      const imageUrl = product.images?.[0] || product.thumbnail || "/image.png";

      // Parse aspect ratio or default to 4/3
      let width = 4;
      let height = 3;

      if (product.aspectRatio) {
        const [w, h] = product.aspectRatio.split("/").map(Number);
        if (w && h) {
          width = w;
          height = h;
        }
      }

      return {
        src: imageUrl,
        width,
        height,
        alt: product.name,
        title: product.name,
        href: `/san-pham/${product._id}`,
        productId: product._id,
      } as PhotoWithProductId & { href: string };
    });
  }, [products]);

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
    <section className="py-20">
      <Container>
        <PhotoAlbum
          layout="masonry"
          photos={photos}
          spacing={16}
          columns={(containerWidth) => {
            if (containerWidth < 640) return 1;
            if (containerWidth < 1024) return 2;
            return 3;
          }}
          render={{
            link: ({ href, children, ...props }) => (
              <Link href={href || "#"} {...props}>
                {children}
              </Link>
            ),
            image: renderNextImage,
          }}
        />
      </Container>
    </section>
  );
}
