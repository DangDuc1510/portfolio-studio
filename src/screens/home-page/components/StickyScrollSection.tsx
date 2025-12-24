"use client";

import React, { ReactNode } from "react";

interface StickyScrollSectionProps {
  background?: {
    videoUrl?: string;
    imageUrl?: string;
    backgroundColor?: string;
  };
  overlay?: {
    color?: string;
    opacity?: number;
  };
  children: ReactNode;
}

export default function StickyScrollSection({
  background,
  overlay,
  children,
}: StickyScrollSectionProps) {
  const videoUrl = background?.videoUrl;
  const imageUrl = background?.imageUrl;
  const backgroundColor = background?.backgroundColor || "bg-midnight";
  const overlayColor = overlay?.color || "midnight";
  const overlayOpacity = overlay?.opacity || 60;

  // Map color names to hex values from color system
  const colorMap: Record<string, string> = {
    midnight: "#0B132B",
    navy: "#0F1C3F",
    moonlight: "#1B3A5D",
  };

  const getOverlayStyle = () => {
    const hexColor = colorMap[overlayColor] || colorMap.midnight;
    const opacityValue = overlayOpacity / 100;

    // Convert hex to rgba
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacityValue})`,
    };
  };

  return (
    <div className="relative w-full">
      {/* Sticky Background - sẽ dính ở top khi scroll */}
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        {videoUrl ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay để đảm bảo nội dung dễ đọc */}
            <div className="absolute inset-0" style={getOverlayStyle()} />
          </>
        ) : imageUrl ? (
          <>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            {/* Overlay để đảm bảo nội dung dễ đọc */}
            <div className="absolute inset-0" style={getOverlayStyle()} />
          </>
        ) : (
          <div className={`w-full h-full ${backgroundColor}`} />
        )}
      </div>

      {/* Scrollable Content Sections - scroll qua trên background */}
      <div className="relative z-10 mt-[-100vh]">{children}</div>
    </div>
  );
}
