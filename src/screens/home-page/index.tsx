"use client";

import React from "react";
import {
  useHomepageSections,
  HomepageSection,
} from "@/hooks/useHomepageSections";
import { useProducts } from "@/hooks/useProducts";
import { useAlbums } from "@/hooks/useAlbums";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import FeaturedContentSection from "./components/FeaturedContentSection";
import StickyScrollSection from "./components/StickyScrollSection";
import LoadingScreen from "@/components/LoadingScreen";

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
