"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Container from "@/components/Container";
import { IHeroSection } from "@/lib/models/AboutPage";

interface AboutHeroProps {
  content: IHeroSection;
}

export default function AboutHero({ content }: AboutHeroProps) {
  const { title, subtitle, backgroundImage, backgroundVideo } = content;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  const hasBackground = backgroundVideo || backgroundImage;
  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Layer */}
      {hasBackground ? (
        <div className="absolute inset-0 z-0">
          {backgroundVideo ? (
            <>
              {/* Video Background */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={backgroundVideo} type="video/mp4" />
              </video>
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/40 to-midnight/80"></div>
            </>
          ) : backgroundImage ? (
            <>
              {/* Image Background */}
              {isExternalImage(backgroundImage) ? (
                <img
                  src={backgroundImage}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={backgroundImage}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/40 to-midnight/80"></div>
            </>
          ) : null}
        </div>
      ) : (
        // Gradient Background (fallback)
        <div className="absolute inset-0 bg-hero-gradient z-0"></div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 hero-animated-bg">
        <div className="hero-animated-bg-inner"></div>
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto py-20">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-pure-white animate-fade-in">
            <span className="text-gradient-fantasy">{title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-ice-white leading-relaxed animate-slide-up">
            {subtitle}
          </p>

          {/* Decorative Line */}
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-spirit-cyan to-transparent glow-cyan"></div>
          </div>
        </div>
      </Container>
    </section>
  );
}

