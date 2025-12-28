"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/Container";
import { IStatsSection } from "@/lib/models/AboutPage";

interface StatsSectionProps {
  content: IStatsSection;
}

export default function StatsSection({ content }: StatsSectionProps) {
  const { isVisible, stats } = content;
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  if (!isVisible || stats.length === 0) {
    return null;
  }

  // Sort stats by order
  const sortedStats = [...stats].sort((a, b) => a.order - b.order);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-hero-gradient-transparent7 relative border-y border-spirit-cyan/20"
    >
      <Container>
        <div
          className={`grid grid-cols-2 md:grid-cols-${Math.min(
            sortedStats.length,
            4
          )} gap-8`}
        >
          {sortedStats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group transition-all duration-500 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Value */}
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-golden mb-3 relative group-hover:scale-110 transition-transform duration-300">
                {stat.value}
                {/* Glow effect on hover */}
                <div className="absolute inset-0 text-gradient-gold opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none">
                  {stat.value}
                </div>
              </div>

              {/* Label */}
              <div className="text-sm sm:text-base text-muted-blue group-hover:text-ice-white transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
