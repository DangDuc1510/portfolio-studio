"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  VerticalAlignTopOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  PictureOutlined,
  HomeOutlined,
  LogoutOutlined,
  ToolOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import OTPInput from "@/components/OTPInput";

const CMS_AUTH_KEY = "cms_authenticated";

interface CmsLayoutProps {
  children: React.ReactNode;
}

export default function CmsLayout({ children }: CmsLayoutProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if already authenticated in sessionStorage
    const authStatus = sessionStorage.getItem(CMS_AUTH_KEY);
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleOTPComplete = (otp: string) => {
    const correctKey = process.env.NEXT_PUBLIC_CMS_API_KEY;

    if (otp === correctKey) {
      sessionStorage.setItem(CMS_AUTH_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Mã truy cập không hợp lệ. Vui lòng thử lại.");
      // Reset after a delay to allow retry
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-muted-blue">Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-spirit-cyan/20 text-center w-full max-w-md shadow-xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-pure-white">
              Truy cập CMS
            </h1>
            <p className="text-muted-blue text-sm">
              Nhập mã truy cập 6 chữ số để tiếp tục
            </p>
          </div>

          <OTPInput length={6} onComplete={handleOTPComplete} error={error} />

          {error && <p className="text-error text-sm mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  const basePath = "/studio/cms";
  const navigationItems = [
    {
      href: basePath,
      label: "Tổng quan",
      icon: DashboardOutlined,
      isActive: pathname === basePath,
    },
    {
      href: `${basePath}/products`,
      label: "Sản phẩm",
      icon: ShoppingOutlined,
      isActive: pathname.includes("/products"),
    },
    {
      href: `${basePath}/albums`,
      label: "Dự án",
      icon: PictureOutlined,
      isActive: pathname.includes("/albums"),
    },
    {
      href: `${basePath}/equipment`,
      label: "Thiết bị",
      icon: ToolOutlined,
      isActive: pathname.includes("/equipment"),
    },
    {
      href: `${basePath}/homepage-sections`,
      label: "Nội dung trang chủ",
      icon: HomeOutlined,
      isActive: pathname.includes("/homepage-sections"),
    },
    {
      href: `${basePath}/page-settings`,
      label: "Cài đặt trang",
      icon: SettingOutlined,
      isActive: pathname.includes("/page-settings"),
    },
    {
      href: "/",
      label: "Về trang chủ",
      icon: LogoutOutlined,
      isActive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-midnight text-ice-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-20" : "w-80"
          } bg-section-gradient backdrop-blur-xl transition-all duration-300 flex flex-col border-r border-spirit-cyan/20 shadow-xl`}
        >
          {/* Logo & Collapse Button */}
          <div
            className={`p-4 pt-8 pb-16 flex items-center ${
              sidebarCollapsed ? "justify-center" : "ml-6 justify-between"
            }`}
          >
            {!sidebarCollapsed && (
              <h1 className="text-2xl font-bold text-pure-white">Labs.</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-moonlight-light text-ice-white transition-colors cursor-pointer border border-spirit-cyan/20 hover:border-spirit-cyan/40"
            >
              <span
                className={`text-sm ${
                  !sidebarCollapsed ? "-rotate-90" : "rotate-90"
                }`}
              >
                <VerticalAlignTopOutlined />
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const hasSubItems = "subItems" in item && item.subItems;

              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 ${
                      !sidebarCollapsed ? "ml-6 px-8" : "px-[14px]"
                    } py-4 rounded-xl transition-all ${
                      item.isActive
                        ? "bg-moonlight-light text-spirit-cyan border-spirit-cyan/40"
                        : "text-ice-white hover:bg-moonlight-light hover:text-spirit-cyan border border-transparent hover:border-spirit-cyan/40"
                    }`}
                  >
                    <IconComponent
                      className={`text-lg ${
                        item.isActive ? "text-spirit-cyan" : "text-ice-white"
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-hero-gradient">
          <div className="flex-1 overflow-y-auto p-6 px-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
