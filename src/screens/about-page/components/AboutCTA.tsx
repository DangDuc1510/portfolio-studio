"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { ICTASection } from "@/lib/models/AboutPage";

interface AboutCTAProps {
  content: ICTASection;
}

export default function AboutCTA({ content }: AboutCTAProps) {
  const { title, description, buttonText, buttonLink } = content;

  return (
    <section className="py-20 bg-hero-gradient-transparent7 relative">
      <Container>
        <div className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-12 border-2 border-spirit-cyan/30 glow-cyan">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-pure-white mb-6">
            {title}
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-blue leading-relaxed mb-8 max-w-2xl mx-auto">
            {description}
          </p>

          {/* CTA Button */}
          <Link
            href={buttonLink}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-golden via-soft-gold to-golden text-midnight font-bold text-lg hover:scale-110 hover:glow-gold transition-all duration-300 shadow-button-glow"
          >
            {buttonText}
          </Link>

          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-spirit-cyan animate-pulse"></div>
            <div
              className="w-2 h-2 rounded-full bg-mystic animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-golden animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
