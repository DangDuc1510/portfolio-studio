"use client";

import Container from "@/components/Container";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
}

const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return "/image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  return `/${imageUrl}`;
};

const isExternalImage = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

export default function PageHero({
  title,
  description,
  backgroundImage,
}: PageHeroProps) {
  const imageUrl = backgroundImage ? getImageUrl(backgroundImage) : null;

  return (
    <section className="mt-20 mb-12">
      {imageUrl && imageUrl !== "/image.png" && (
        <div className="relative w-full aspect-video max-h-[30vh] overflow-hidden bg-moonlight">
          {isExternalImage(imageUrl) ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>
      )}
      <Container>
        <div className="flex flex-col gap-8 mt-12">
          {/* Image - Top */}

          {/* Content - Bottom, 2 rows */}
          <div className="flex flex-col gap-4 text-center">
            {/* Row 1: Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-pure-white">
              {title}
            </h1>
            {/* Row 2: Description */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-blue max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
