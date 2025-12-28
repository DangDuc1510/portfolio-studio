"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import Container from "@/components/Container";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/san-pham", label: "Sản phẩm" },
    { href: "/ve-chung-toi", label: "Về chúng tôi" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-midnight/40 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-ice-white text-xl font-bold hover:text-spirit-cyan transition-colors"
          >
            <span>Portfolio Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.href)
                      ? "bg-secondary-cyan text-midnight font-medium"
                      : "text-ice-white hover:bg-moonlight-light"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/dat-lich"
              className="ml-2 px-6 py-2 bg-golden hover:opacity-90 text-midnight font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              Đăt lịch ngay
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-ice-white p-2 hover:bg-moonlight-light rounded-lg transition-colors"
            aria-label="Đổi trạng thái menu"
          >
            {isMenuOpen ? (
              <CloseOutlined className="text-2xl" />
            ) : (
              <MenuOutlined className="text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-spirit-cyan/20 mt-4 pt-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.href)
                        ? "bg-secondary-cyan text-midnight font-medium"
                        : "text-ice-white hover:bg-moonlight-light"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/dat-lich"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-6 py-3 bg-golden hover:opacity-90 text-midnight font-semibold rounded-lg text-center hover:shadow-lg transition-all"
              >
                Đăt lịch ngay
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
