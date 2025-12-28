"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  useHomepageSections,
  HomepageSection,
} from "@/hooks/useHomepageSections";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import StickyScrollSection from "./components/StickyScrollSection";
import LoadingScreen from "@/components/LoadingScreen";

// Dynamic import to avoid hydration mismatch (Math.random() issue)
const FeaturedContentSection = dynamic(
  () => import("./components/FeaturedContentSection"),
  {
    ssr: false,
  }
);

export default function HomePage() {
  const { data: sections = [], isLoading: isLoadingSections } =
    useHomepageSections();

  const isLoading = isLoadingSections;

  const heroSection = sections.find(
    (s: HomepageSection) => s.sectionName.toLowerCase() === "hero"
  );
  const aboutSection = sections.find(
    (s: HomepageSection) => s.sectionName.toLowerCase() === "about"
  );
  const featuredContentSection = sections.find(
    (s: HomepageSection) => s.sectionName.toLowerCase() === "featured-content"
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="">
      <StickyScrollSection
        background={{
          videoUrl: featuredContentSection.content?.videoUrl,
        }}
      >
        {heroSection?.isVisible && (
          <HeroSection content={heroSection.content} />
        )}
        {aboutSection?.isVisible && (
          <AboutSection content={aboutSection.content} />
        )}
        {featuredContentSection?.isVisible && (
          <FeaturedContentSection content={featuredContentSection.content} />
        )}
      </StickyScrollSection>
    </div>
  );
}
