"use client";

import Image from "next/image";
import Container from "@/components/Container";
import { IStorySection } from "@/lib/models/AboutPage";

interface StorySectionProps {
  content: IStorySection;
}

export default function StorySection({ content }: StorySectionProps) {
  const { title, content: storyContent, images } = content;

  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  return (
    <section className="py-20 bg-section-gradient relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-pure-white mb-6">
              {title}
            </h2>
            <div className="text-lg text-muted-blue leading-relaxed whitespace-pre-line">
              {storyContent}
            </div>
          </div>

          {/* Images Gallery */}
          {images && images.length > 0 && (
            <div className="relative">
              {images.length === 1 ? (
                // Single Image
                <div className="relative rounded-2xl overflow-hidden glass-card border-2 border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group aspect-[4/3]">
                  {isExternalImage(images[0]) ? (
                    <img
                      src={images[0]}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src={images[0]}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-spirit-cyan/0 via-transparent to-mystic/0 group-hover:from-spirit-cyan/10 group-hover:to-mystic/10 transition-all duration-500"></div>
                </div>
              ) : (
                // Multiple Images Grid
                <div className="grid grid-cols-2 gap-4">
                  {images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className={`relative rounded-xl overflow-hidden glass-card border border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group ${
                        index === 0 && images.length === 3
                          ? "col-span-2"
                          : "aspect-square"
                      }`}
                      style={
                        index === 0 && images.length === 3
                          ? { aspectRatio: "16/9" }
                          : {}
                      }
                    >
                      {isExternalImage(image) ? (
                        <img
                          src={image}
                          alt={`${title} ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <Image
                          src={image}
                          alt={`${title} ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-spirit-cyan/0 to-mystic/0 group-hover:from-spirit-cyan/10 group-hover:to-mystic/10 transition-all duration-500"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

