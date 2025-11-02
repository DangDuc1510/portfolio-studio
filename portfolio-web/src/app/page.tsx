import { getProducts, getAlbums, getHomepageSections } from "../lib/api";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import AlbumsShowcase from "../components/sections/AlbumsShowcase";
import ContactSection from "../components/sections/ContactSection";

export default async function Home() {
  // Fetch data in parallel
  const [productsData, albumsData, homepageSections] = await Promise.all([
    getProducts({ limit: 6 }),
    getAlbums(),
    getHomepageSections(),
  ]);

  const products = productsData?.data || [];
  const albums = albumsData || [];
  const sections = homepageSections || [];

  // Get section contents
  const heroSection = sections.find((s: any) => s.sectionName === "hero");
  const aboutSection = sections.find((s: any) => s.sectionName === "about");

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
