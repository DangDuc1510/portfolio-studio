"use client";

import Image from "next/image";
import Container from "@/components/Container";

interface AboutSectionProps {
  content?: {
    title?: string;
    description?: string;
    image?: string;
    stats?: Array<{ label: string; value: string }>;
  };
}

export default function AboutSection({ content }: AboutSectionProps) {
  if (!content) return null;

  const { title = "Về chúng tôi", description, image, stats = [] } = content;

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

  const imageUrl = image ? getImageUrl(image) : "/image.png";

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-hero-gradient-transparent5 relative">
      <Container>
        <div className="flex gap-12 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden glass-card border-2 border-spirit-cyan/20 max-h-[400px] min-w-[400px] hover:border-spirit-cyan/40 hover:glow-cyan transition-all duration-300 group">
            {imageUrl && imageUrl !== "/image.png" ? (
              isExternalImage(imageUrl) ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover max-h-[400px] content-center items-center justify-center group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full relative">
                  <Image
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover max-h-[400px] content-center items-center justify-center group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={400}
                  />
                </div>
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-moonlight to-navy flex items-center justify-center">
                <span className="text-muted-blue text-lg">Hình ảnh sắp có</span>
              </div>
            )}
            {/* Glow overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-spirit-cyan/0 via-transparent to-mystic/0 group-hover:from-spirit-cyan/10 group-hover:to-mystic/10 transition-all duration-500 pointer-events-none"></div>
          </div>

          {/* Content */}
          <div className="space-y-8 flex-1">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pure-white mb-6">
                {title}
              </h2>
              {description && (
                <p className="text-lg text-muted-blue leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-spirit-cyan/20">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group/stat hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-golden mb-2 relative">
                      {stat.value}
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 text-gradient-gold opacity-0 group-hover/stat:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none">
                        {stat.value}
                      </div>
                    </div>
                    <div className="text-sm text-muted-blue">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
