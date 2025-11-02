"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, getAlbums, getHomepageSections } from "../lib/api";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import AlbumsShowcase from "../components/sections/AlbumsShowcase";
import ContactSection from "../components/sections/ContactSection";

export default function Home() {
  // Fetch data using React Query
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", { limit: 6 }],
    queryFn: () => getProducts({ limit: 6 }),
  });

  const { data: albums, isLoading: isLoadingAlbums } = useQuery({
    queryKey: ["albums"],
    queryFn: () => getAlbums(),
  });

  const { data: sections, isLoading: isLoadingSections } = useQuery({
    queryKey: ["homepageSections"],
    queryFn: () => getHomepageSections(),
  });

  const products = productsData?.data || [];
  const albumsData = albums || [];
  const sectionsData = sections || [];

  // Get section contents
  const heroSection = sectionsData.find(
    (s: { sectionName: string }) => s.sectionName === "hero"
  );
  const aboutSection = sectionsData.find(
    (s: { sectionName: string }) => s.sectionName === "about"
  );

  const isLoading = isLoadingProducts || isLoadingAlbums || isLoadingSections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <Header />

      <main>
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-lg">Loading...</div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {heroSection?.isVisible && (
              <HeroSection content={heroSection.content} />
            )}

            {/* About Section */}
            {aboutSection?.isVisible && (
              <AboutSection content={aboutSection.content} />
            )}

            {/* Featured Products */}
            {products.length > 0 && (
              <FeaturedProducts
                products={products}
                title="Featured Works"
                subtitle="Explore our latest photography and videography projects"
              />
            )}

            {/* Albums Showcase */}
            {albumsData.length > 0 && (
              <AlbumsShowcase
                albums={albumsData}
                title="Photo Albums"
                subtitle="Browse our curated collections"
              />
            )}

            {/* Contact Section */}
            <ContactSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
