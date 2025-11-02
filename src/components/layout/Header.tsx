"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
  PictureOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: HomeOutlined },
    { href: "/products", label: "Portfolio", icon: PictureOutlined },
    { href: "/albums", label: "Albums", icon: FolderOutlined },
    { href: "/about", label: "About", icon: InfoCircleOutlined },
    { href: "/contact", label: "Contact", icon: MailOutlined },
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
        isScrolled
          ? "bg-gradient-to-br from-[#1C1C1C]/95 to-[#343434]/95 backdrop-blur-xl shadow-lg border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white text-xl font-bold hover:text-[#FFDD00] transition-colors"
          >
            <PictureOutlined className="text-2xl" />
            <span>Portfolio Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.href)
                      ? "bg-[#FFDD00] text-[#1C1C1C] font-medium"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="ml-2 px-6 py-2 bg-gradient-to-br from-[#FFDD00] to-[#FFED4E] text-[#1C1C1C] font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              Book Session
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
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
          <div className="md:hidden pb-6 border-t border-white/10 mt-4 pt-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.href)
                        ? "bg-[#FFDD00] text-[#1C1C1C] font-medium"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-6 py-3 bg-gradient-to-br from-[#FFDD00] to-[#FFED4E] text-[#1C1C1C] font-semibold rounded-lg text-center hover:shadow-lg transition-all"
              >
                Book Session
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

