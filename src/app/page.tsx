import { getProducts, getAlbums, getHomepageSections } from "../lib/api";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import AlbumsShowcase from "../components/sections/AlbumsShowcase";
import ContactSection from "../components/sections/ContactSection";

// Disable static generation to allow dynamic data fetching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // Fetch data in parallel with error handling
  let products = [];
  let albums = [];
  let sections = [];

  try {
    const [productsData, albumsData, homepageSections] = await Promise.all([
      getProducts({ limit: 6 }).catch(() => ({ data: [] })),
      getAlbums().catch(() => []),
      getHomepageSections().catch(() => []),
    ]);

    products = productsData?.data || [];
    albums = albumsData || [];
    sections = homepageSections || [];
  } catch (error) {
    // If data fetching fails during build, use empty arrays
    // This allows the build to succeed and data will load at runtime
    console.error("Error fetching data:", error);
  }

  // Get section contents
  const heroSection = sections.find(
    (s: { sectionName: string }) => s.sectionName === "hero"
  );
  const aboutSection = sections.find(
    (s: { sectionName: string }) => s.sectionName === "about"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#343434]">
      <Header />

      <main>
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
        {albums.length > 0 && (
          <AlbumsShowcase
            albums={albums}
            title="Photo Albums"
            subtitle="Browse our curated collections"
          />
        )}

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
