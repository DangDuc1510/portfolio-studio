"use client";

import Container from "@/components/Container";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
}

export default function PageHero({
  title,
  description,
  backgroundImage,
}: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/60 to-midnight" />
        </div>
      )}

      {/* Content */}
      <Container className="relative z-10 text-center py-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-pure-white">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-blue max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </Container>

      {/* Gradient Overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent z-10" />
    </section>
  );
}

