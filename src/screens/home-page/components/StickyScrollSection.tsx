"use client";

import React, { ReactNode, useRef, useEffect, useState } from "react";

interface StickyScrollSectionProps {
  background?: {
    videoUrl?: string;
    imageUrl?: string;
    backgroundColor?: string;
    posterUrl?: string; // Poster image for video
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
  const posterUrl = background?.posterUrl;
  const backgroundColor = background?.backgroundColor || "bg-midnight";
  const overlayColor = overlay?.color || "midnight";
  const overlayOpacity = overlay?.opacity || 60;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

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

  // Intersection Observer để chỉ play video khi section visible
  useEffect(() => {
    if (!videoUrl || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVideoVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger khi 10% section visible
        rootMargin: "50px", // Trigger sớm hơn một chút để smooth hơn
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videoUrl]);

  // Control video playback based on visibility
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;

    const handlePlay = async () => {
      try {
        if (isVideoVisible) {
          await video.play();
        } else {
          video.pause();
        }
      } catch (error) {
        // Handle autoplay restrictions
        console.warn("Video autoplay failed:", error);
      }
    };

    handlePlay();
  }, [isVideoVisible, videoUrl]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Sticky Background - sẽ dính ở top khi scroll */}
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              preload="none" // Không preload để giảm tải ban đầu
              poster={posterUrl} // Hiển thị poster image trước khi video load
              className="w-full h-full object-cover"
              onLoadedData={() => {
                // Chỉ play khi đã load xong và visible
                if (isVideoVisible && videoRef.current) {
                  videoRef.current.play().catch(() => {
                    // Ignore autoplay errors
                  });
                }
              }}
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
