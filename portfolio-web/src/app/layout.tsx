import type { Metadata } from "next";
import "@/app/globals.css";
import React from "react";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';

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
        <AntdRegistry>
          <ConfigProvider theme={{
            token: {
              colorPrimary: '#FFDD00',
            },
          }}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
