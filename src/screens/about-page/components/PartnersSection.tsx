"use client";

import Image from "next/image";
import Container from "@/components/Container";
import { IPartnersSection } from "@/lib/models/AboutPage";

interface PartnersSectionProps {
  content: IPartnersSection;
}

export default function PartnersSection({ content }: PartnersSectionProps) {
  const { isVisible, title, logos } = content;

  if (!isVisible || logos.length === 0) {
    return null;
  }

  const isExternalImage = (url: string) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  // Sort logos by order
  const sortedLogos = [...logos].sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 bg-section-gradient relative">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-pure-white mb-4">
            {title}
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {sortedLogos.map((partner, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 border border-spirit-cyan/20 hover:border-spirit-cyan/40 transition-all duration-300 group hover:scale-110 hover:glow-cyan flex items-center justify-center aspect-square"
            >
              {partner.url ? (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex items-center justify-center"
                >
                  {isExternalImage(partner.logo) ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  )}
                </a>
              ) : (
                <>
                  {isExternalImage(partner.logo) ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

