"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  content?: {
    heading1?: string;
    heading2?: string;
    subheading1?: string;
    subheading2?: string;
    tags?: string[];
  };
}

// Animation variants cho các phần tử
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HeroSection({ content }: HeroSectionProps) {
  if (!content) return null;

  const heading1 = content.heading1 || "Creative Developer";
  const heading2 = content.heading2 || "& Designer";
  const subheading1 =
    content.subheading1 ||
    "Crafting beautiful digital experiences with modern web technologies";
  const subheading2 =
    content.subheading2 || "Bringing fantasy to life through code";
  const tags = Array.isArray(content.tags)
    ? content.tags
    : ["React", "Next.js", "TypeScript", "Tailwind", "Node.js"];

  // Nhân 3 để marquee chạy mượt hơn
  const tagsTripled = [...tags, ...tags, ...tags];

  // Chia heading thành các từ để animate từng từ
  const heading1Words = heading1.split(" ");
  const heading2Words = heading2 ? heading2.split(" ") : [];
  const subheading1Words = subheading1.split(" ");
  const subheading2Words = subheading2 ? subheading2.split(" ") : [];

  return (
    <section className="bg-hero-gradient-transparent3 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 hero-animated-bg-inner">
        <motion.div
          className="text-center w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.h1
            className="text-gradient-fantasy text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight px-4"
            variants={itemVariants}
          >
            {heading1Words.map((word, index) => (
              <motion.span
                key={`heading1-${index}`}
                variants={wordVariants}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
            {heading2 && (
              <>
                <br />
                <motion.span
                  className="text-gradient-gold inline-block"
                  variants={itemVariants}
                >
                  {heading2Words.map((word, index) => (
                    <motion.span
                      key={`heading2-${index}`}
                      variants={wordVariants}
                      className="inline-block mr-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
              </>
            )}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-ice-white text-lg sm:text-xl md:text-2xl mb-8 w-full mx-auto leading-relaxed px-4 sm:px-8"
            variants={itemVariants}
          >
            {subheading1Words.map((word, index) => (
              <motion.span
                key={`subheading1-${index}`}
                variants={wordVariants}
                className="inline-block mr-1.5"
              >
                {word}
              </motion.span>
            ))}
            {subheading2 && (
              <>
                <br />
                <motion.span
                  className="text-muted-blue inline-block"
                  variants={itemVariants}
                >
                  {subheading2Words.map((word, index) => (
                    <motion.span
                      key={`subheading2-${index}`}
                      variants={wordVariants}
                      className="inline-block mr-1.5"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
              </>
            )}
          </motion.p>

          {/* Tech Stack Marquee */}
          {tags.length > 0 && (
            <motion.div
              className="tech-marquee-container mt-32 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              <div className="tech-marquee">
                {tagsTripled.map((tech, index) => (
                  <div
                    key={`${tech}-${index}`}
                    className="tech-marquee-item group bg-moonlight/50 backdrop-blur-sm border border-spirit-cyan/20 text-ice-white px-4 py-2 rounded-lg text-sm font-medium hover:border-spirit-cyan/40 hover:glow-cyan transition-all cursor-pointer flex items-center gap-2 flex-shrink-0"
                  >
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
