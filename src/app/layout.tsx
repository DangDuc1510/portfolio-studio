import type { Metadata } from "next";
import "@/app/globals.css";
import React from "react";
import Providers from "./providers";
import { Toaster } from "sonner";
import { sonnerTheme } from "@/utils/sonner-theme";

export const metadata: Metadata = {
  title: "Portfolio Studio",
  description: "Ứng dụng web cho studio nhiếp ảnh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
        <Toaster {...sonnerTheme} />
      </body>
    </html>
  );
}
