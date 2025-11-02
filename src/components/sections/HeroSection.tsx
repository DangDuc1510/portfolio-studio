"use client";

import Link from "next/link";
import { PlayCircleOutlined } from "@ant-design/icons";

interface HeroSectionProps {
  content?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    videoUrl?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  };
}

export default function HeroSection({ content }: HeroSectionProps) {
  if (!content) return null;

  const {
    title = "Welcome to Portfolio Studio",
    subtitle = "Capturing your precious moments",
    backgroundImage,
    videoUrl,
    primaryButtonText = "View Portfolio",
    primaryButtonLink = "/products",
    secondaryButtonText = "Contact Us",
    secondaryButtonLink = "/contact",
  } = content;

  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      >
        {videoUrl && (
          <div className="absolute inset-0">
            <iframe
              src={videoUrl}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1C]/80 via-[#343434]/70 to-[#1C1C1C]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryButtonText && (
            <Link
              href={primaryButtonLink || "/products"}
              className="px-8 py-4 bg-gradient-to-br from-[#FFDD00] to-[#FFED4E] text-[#1C1C1C] font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
            >
              {primaryButtonText}
            </Link>
          )}
          {secondaryButtonText && (
            <Link
              href={secondaryButtonLink || "/contact"}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

