"use client";

import Image from "next/image";

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

  const {
    title = "About Us",
    description,
    image,
    stats = [],
  } = content;

  return (
    <section className="py-20 bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#414141] to-[#2C2C2C] flex items-center justify-center">
                <span className="text-gray-400 text-lg">Image coming soon</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                {title}
              </h2>
              {description && (
                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-[#FFDD00] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

