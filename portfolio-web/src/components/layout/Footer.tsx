"use client";

import Link from "next/link";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#1C1C1C] to-[#343434] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-[#FFDD00]">Portfolio Studio</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Professional photography and videography services. Capturing your
              precious moments with creativity and excellence.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#FFDD00] hover:text-[#1C1C1C] text-white transition-all"
                aria-label="Facebook"
              >
                <FacebookOutlined className="text-lg" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#FFDD00] hover:text-[#1C1C1C] text-white transition-all"
                aria-label="Instagram"
              >
                <InstagramOutlined className="text-lg" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#FFDD00] hover:text-[#1C1C1C] text-white transition-all"
                aria-label="YouTube"
              >
                <YoutubeOutlined className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-[#FFDD00] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-[#FFDD00] transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/albums"
                  className="text-gray-400 hover:text-[#FFDD00] transition-colors"
                >
                  Albums
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-[#FFDD00] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-[#FFDD00] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MailOutlined className="text-lg mt-0.5" />
                <a
                  href="mailto:info@portfoliostudio.com"
                  className="hover:text-[#FFDD00] transition-colors"
                >
                  info@portfoliostudio.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <PhoneOutlined className="text-lg mt-0.5" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-[#FFDD00] transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <EnvironmentOutlined className="text-lg mt-0.5" />
                <span>123 Studio Street, City, Country</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>
            © {currentYear} Portfolio Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

