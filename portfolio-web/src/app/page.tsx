import { Button } from "antd";
import { getProducts, getAlbums, getHomepageSections, createCustomer } from '../lib/api';
import { ContactForm } from '../components/ContactForm';

// Giả định các component này đã được định nghĩa ở nơi khác
const HeroSection = ({ content }: { content: any }) => <section className="py-16 bg-gray-100">Hero: {JSON.stringify(content)}</section>;
const ProductGrid = ({ products }: { products: any[] }) => <section className="py-16 bg-white">Products: {JSON.stringify(products)}</section>;
const AlbumDisplay = ({ albums }: { albums: any[] }) => <section className="py-16 bg-gray-100">Albums: {JSON.stringify(albums)}</section>;

export default async function Home() {
  const products = await getProducts();
  const albums = await getAlbums();
  const homepageSections = await getHomepageSections();

  const heroSectionContent = homepageSections.find((s:any) => s.sectionName === 'hero')?.content;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {heroSectionContent && <HeroSection content={heroSectionContent} />}
      <ProductGrid products={products} />
      <AlbumDisplay albums={albums} />
      <ContactForm />
    </div>
  );
}
