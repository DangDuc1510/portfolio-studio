import Header from "./Header";
import Footer from "./Footer";
import FixedContactButton from "@/components/FixedContactButton";

interface ClientPublicLayoutProps {
  children: React.ReactNode;
}

export default function ClientPublicLayout({
  children,
}: ClientPublicLayoutProps) {
  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FixedContactButton />
    </div>
  );
}

