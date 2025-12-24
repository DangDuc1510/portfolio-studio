"use client";

import React from "react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = "Đang tải...",
  fullScreen = true,
}: LoadingScreenProps) {
  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center bg-hero-gradient hero-animated-bg relative overflow-hidden"
    : "flex items-center justify-center relative overflow-hidden py-12";

  return (
    <div className={containerClass} role="status" aria-live="polite" aria-label="Đang tải nội dung">
      <div className="flex flex-col items-center justify-center gap-6 z-10">
        {/* Spinner với animation xoay và glow */}
        <div
          className="relative w-20 h-20 flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Outer ring - Cyan (80px = w-20 h-20) */}
          <div className="absolute w-20 h-20 border-4 border-transparent border-t-[var(--color-spirit-cyan)] rounded-full animate-spin-slow">
            <div className="absolute inset-0 border-4 border-transparent border-r-[var(--color-spirit-cyan)] rounded-full animate-spin-slow-reverse opacity-50"></div>
          </div>

          {/* Middle ring - Purple (64px = w-16 h-16, offset 8px từ mỗi bên để căn giữa trong container 80px) */}
          <div className="absolute w-16 h-16 border-4 border-transparent border-b-[var(--color-mystic)] rounded-full animate-spin-slow opacity-70 top-2 left-2"></div>

          {/* Inner ring - Gold (48px = w-12 h-12, offset 16px từ mỗi bên để căn giữa trong container 80px) */}
          <div className="absolute w-12 h-12 border-4 border-transparent border-l-[var(--color-golden)] rounded-full animate-spin-slow-reverse opacity-60 top-4 left-4"></div>

        </div>

        {/* Text với animation */}
        <div className="text-center">
          <p className="text-muted-blue text-lg font-medium animate-fade-pulse">
            {message}
          </p>
          {/* Loading dots */}
          <div className="flex gap-1 justify-center mt-2">
            <span
              className="w-2 h-2 bg-[var(--color-spirit-cyan)] rounded-full animate-bounce-dot"
              style={{ animationDelay: "0s" }}
            ></span>
            <span
              className="w-2 h-2 bg-[var(--color-mystic)] rounded-full animate-bounce-dot"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-2 h-2 bg-[var(--color-golden)] rounded-full animate-bounce-dot"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--color-spirit-cyan)] rounded-full opacity-30 animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--color-mystic)] rounded-full opacity-30 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[var(--color-golden)] rounded-full opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-[var(--color-spirit-cyan)] rounded-full opacity-30 animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        {/* <div
          className="absolute top-1/2 right-1/2 w-2 h-2 bg-[var(--color-mystic)] rounded-full opacity-30 animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div> */}
      </div>
    </div>
  );
}
