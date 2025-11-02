"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  VerticalAlignTopOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  PictureOutlined,
  TeamOutlined,
  HomeOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import OTPInput from "@/components/OTPInput";

const CMS_AUTH_KEY = "cms_authenticated";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
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
      setError("Invalid access code. Please try again.");
      // Reset after a delay to allow retry
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#343434] to-[#1C1C1C] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#343434] to-[#1C1C1C] flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10 text-center w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">CMS Access</h1>
            <p className="text-gray-400 text-sm">
              Enter your 6-digit access code to continue
            </p>
          </div>

          <OTPInput length={6} onComplete={handleOTPComplete} error={error} />

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  const basePath = "/studio-manage/cms";
  const navigationItems = [
    {
      href: basePath,
      label: "Dashboard",
      icon: DashboardOutlined,
      isActive: pathname === basePath,
    },
    {
      href: `${basePath}/products`,
      label: "Products",
      icon: ShoppingOutlined,
      isActive: pathname.includes("/products"),
    },
    {
      href: `${basePath}/categories`,
      label: "Categories",
      icon: AppstoreOutlined,
      isActive: pathname.includes("/categories"),
    },
    {
      href: `${basePath}/albums`,
      label: "Albums",
      icon: PictureOutlined,
      isActive: pathname.includes("/albums"),
    },
    {
      href: `${basePath}/customers`,
      label: "Customers",
      icon: TeamOutlined,
      isActive: pathname.includes("/customers"),
    },
    {
      href: `${basePath}/homepage-sections`,
      label: "Homepage Sections",
      icon: HomeOutlined,
      isActive: pathname.includes("/homepage-sections"),
    },
    {
      href: "/",
      label: "Back to Website",
      icon: LogoutOutlined,
      isActive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#343434] to-[#1C1C1C]">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-20" : "w-80"
          } bg-gradient-to-br from-[#414141] via-[#303030] to-[#2C2C2C] backdrop-blur-xl  transition-all duration-300 flex flex-col `}
        >
          {/* Logo & Collapse Button */}
          <div
            className={`p-4 pt-8 pb-16 flex items-center ${
              sidebarCollapsed ? "justify-center" : "ml-6 justify-between"
            }`}
          >
            {!sidebarCollapsed && (
              <h1 className="text-2xl font-bold text-white">Labs.</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-gradient-to-b hover:from-[#4B4B4B] hover:to-[#41411] text-white transition-colors cursor-pointer border border-white/10"
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
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 ${
                    !sidebarCollapsed ? "ml-6 px-8" : "px-[14px]"
                  } py-4 rounded-xl transition-all ${
                    item.isActive
                      ? "bg-gradient-to-b from-[#4B4B4B] to-[#41411] text-white"
                      : " hover:bg-gradient-to-b hover:from-[#4B4B4B] hover:to-[#41411] text-white"
                  }`}
                >
                  <IconComponent
                    className="text-lg"
                    style={{ color: "white" }}
                  />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          {/* <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-white">
                👤
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">
                    Neuer Nutzer
                  </p>
                  <p className="text-gray-400 text-xs">Administrator</p>
                </div>
              )}
            </div>
          </div> */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
