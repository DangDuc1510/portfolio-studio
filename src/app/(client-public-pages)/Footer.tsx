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
import {
  useHomepageSections,
  useHomepageSection,
} from "@/hooks/useHomepageSections";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: sections = [] } = useHomepageSections();
  const footerSection = useHomepageSection("footer", sections);

  const content = footerSection?.content || {};
  const isVisible = footerSection?.isVisible !== false;

  // Default values
  const brandName = (content.brandName as string) || "Portfolio Studio";
  const brandDescription =
    (content.brandDescription as string) ||
    "Dịch vụ nhiếp ảnh và quay phim chuyên nghiệp. Lưu giữ khoảnh khắc của bạn với sự sáng tạo và tinh tế.";
  const facebookUrl = (content.facebookUrl as string) || "https://facebook.com";
  const instagramUrl =
    (content.instagramUrl as string) || "https://instagram.com";
  const youtubeUrl = (content.youtubeUrl as string) || "https://youtube.com";
  const email = (content.email as string) || "info@portfoliostudio.com";
  const phone = (content.phone as string) || "+84 123 456 789";
  const address =
    (content.address as string) || "123 Studio Street, Thành phố, Việt Nam";
  const aboutLink = (content.aboutLink as string) || "/ve-chung-toi";

  if (!isVisible) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-midnight to-navy border-t border-spirit-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-pure-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-spirit-cyan">{brandName}</span>
            </h3>
            <p className="text-muted-blue mb-4">{brandDescription}</p>
            <div className="flex gap-4">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-moonlight hover:bg-spirit-cyan hover:text-midnight text-ice-white transition-all"
                  aria-label="Facebook"
                >
                  <FacebookOutlined className="text-lg" />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-moonlight hover:bg-spirit-cyan hover:text-midnight text-ice-white transition-all"
                  aria-label="Instagram"
                >
                  <InstagramOutlined className="text-lg" />
                </a>
              )}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-moonlight hover:bg-spirit-cyan hover:text-midnight text-ice-white transition-all"
                  aria-label="YouTube"
                >
                  <YoutubeOutlined className="text-lg" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-pure-white font-semibold mb-4">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-blue hover:text-spirit-cyan transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/san-pham"
                  className="text-muted-blue hover:text-spirit-cyan transition-colors"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href={aboutLink}
                  className="text-muted-blue hover:text-spirit-cyan transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-pure-white font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              {email && (
                <li className="flex items-start gap-3 text-muted-blue">
                  <MailOutlined className="text-lg mt-0.5" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-spirit-cyan transition-colors"
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-3 text-muted-blue">
                  <PhoneOutlined className="text-lg mt-0.5" />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-spirit-cyan transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-3 text-muted-blue">
                  <EnvironmentOutlined className="text-lg mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-spirit-cyan/20 text-center text-muted-blue text-sm">
          <p>© {currentYear} {brandName}. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  );
}
