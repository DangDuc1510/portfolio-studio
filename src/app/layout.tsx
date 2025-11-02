import type { Metadata } from "next";
import "@/app/globals.css";
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Portfolio Studio",
  description: "Web application for a photography studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#FFDD00",
                  colorBgContainer: "#2C2C2C",
                  colorText: "#ffffff",
                  colorBorder: "rgba(255, 255, 255, 0.1)",
                  colorTextPlaceholder: "#9ca3af",
                  colorBgElevated: "#414141",
                },
                components: {
                  Select: {
                    optionSelectedBg: "#4B4B4B",
                    optionActiveBg: "#4B4B4B",
                    selectorBg: "#2C2C2C",
                  },
                  Switch: {
                    colorPrimary: "#FFDD00",
                    colorPrimaryHover: "#FFED4E",
                    colorTextQuaternary: "#414141",
                    colorTextTertiary: "#4B4B4B",
                  },
                  Input: {
                    colorBgContainer: "#2C2C2C",
                    colorBorder: "rgba(255, 255, 255, 0.1)",
                    colorText: "#ffffff",
                    colorTextPlaceholder: "#9ca3af",
                  },
                },
              }}
            >
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
