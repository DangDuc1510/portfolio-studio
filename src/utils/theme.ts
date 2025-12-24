/**
 * THEME UTILITIES
 * Helper functions and utilities for working with the Fantasy Portfolio theme
 */

import {
  COLORS,
  GRADIENTS,
  SHADOWS,
  BUTTON_COLORS,
  CARD_COLORS,
  INPUT_COLORS,
  TOAST_COLORS,
  BADGE_COLORS,
  LINK_COLORS,
  DIVIDER_COLORS,
  OPACITY,
  type ColorKey,
  type GradientKey,
  type ShadowKey,
} from "@/constants/colors";

// ============================================
// 🎨 COLOR UTILITIES
// ============================================

/**
 * Get a color value by key
 * @example getColor('spiritCyan') // returns '#4FD1FF'
 */
export function getColor(key: ColorKey): string {
  return COLORS[key];
}

/**
 * Get a gradient by key
 * @example getGradient('ctaPrimary') // returns 'linear-gradient(...)'
 */
export function getGradient(key: GradientKey): string {
  return GRADIENTS[key];
}

/**
 * Get a shadow by key
 * @example getShadow('glowCyan') // returns '0 0 20px rgba(...)'
 */
export function getShadow(key: ShadowKey): string {
  return SHADOWS[key];
}

/**
 * Convert hex color to RGBA with opacity
 * @example hexToRgba('#4FD1FF', 0.5) // returns 'rgba(79, 209, 255, 0.5)'
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Create a color with opacity
 * @example colorWithOpacity('spiritCyan', 0.3) // returns 'rgba(79, 209, 255, 0.3)'
 */
export function colorWithOpacity(key: ColorKey, alpha: number): string {
  return hexToRgba(COLORS[key], alpha);
}

// ============================================
// 🎯 COMPONENT STYLE GENERATORS
// ============================================

/**
 * Generate button styles based on variant
 */
export function getButtonStyles(
  variant: "primary" | "secondary" | "ghost" | "text" | "danger" = "primary"
) {
  const colors = BUTTON_COLORS[variant];

  if (variant === "primary") {
    return {
      background: colors.gradient,
      color: colors.text,
      border: "none",
      boxShadow: colors.shadow,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: colors.gradientHover,
        color: colors.textHover,
        transform: "translateY(-2px)",
        boxShadow: SHADOWS.glowGold,
      },
      "&:active": {
        transform: "translateY(0)",
      },
    };
  }

  if (variant === "secondary") {
    return {
      background: colors.gradient,
      color: colors.text,
      border: "none",
      boxShadow: colors.shadow,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: colors.bgHover,
        color: colors.textHover,
        transform: "translateY(-2px)",
        boxShadow: SHADOWS.glowCyanStrong,
      },
    };
  }

  if (variant === "ghost") {
    return {
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: colors.bgHover,
        color: colors.textHover,
        borderColor: colors.borderHover,
      },
    };
  }

  if (variant === "text") {
    return {
      background: colors.bg,
      color: colors.text,
      border: "none",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: colors.bgHover,
        color: colors.textHover,
      },
    };
  }

  if (variant === "danger") {
    return {
      background: colors.bg,
      color: colors.text,
      border: "none",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: colors.bgHover,
        transform: "translateY(-2px)",
      },
    };
  }

  return {};
}

/**
 * Generate card styles based on variant
 */
export function getCardStyles(
  variant: "standard" | "glass" | "elevated" | "featured" = "standard"
) {
  const colors = CARD_COLORS[variant];

  if (variant === "glass") {
    return {
      background: colors.bgGradient,
      backdropFilter: colors.backdrop,
      border: `1px solid ${colors.border}`,
      boxShadow: colors.shadow,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  }

  if (variant === "elevated") {
    return {
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      boxShadow: colors.shadow,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  }

  if (variant === "featured") {
    return {
      background: colors.bgGradient,
      border: `2px solid ${colors.border}`,
      boxShadow: colors.shadow,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: SHADOWS.glowCyanStrong,
      },
    };
  }

  return {
    background: colors.bgGradient || colors.bg,
    border: `1px solid ${colors.border}`,
    boxShadow: colors.shadow,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  };
}

/**
 * Generate input styles
 */
export function getInputStyles() {
  return {
    background: INPUT_COLORS.bg,
    color: INPUT_COLORS.text,
    border: `1px solid ${INPUT_COLORS.border}`,
    boxShadow: INPUT_COLORS.shadow,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::placeholder": {
      color: INPUT_COLORS.placeholder,
    },
    "&:hover": {
      borderColor: INPUT_COLORS.borderHover,
    },
    "&:focus": {
      background: INPUT_COLORS.bgFocus,
      borderColor: INPUT_COLORS.borderFocus,
      boxShadow: INPUT_COLORS.shadowFocus,
      outline: "none",
    },
    "&:disabled": {
      background: INPUT_COLORS.bgDisabled,
      color: INPUT_COLORS.textDisabled,
      cursor: "not-allowed",
    },
  };
}

/**
 * Generate toast/notification styles based on type
 */
export function getToastStyles(
  type: "success" | "error" | "warning" | "info" = "info"
) {
  const colors = TOAST_COLORS[type];

  return {
    background: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    boxShadow: colors.shadow,
    backdropFilter: "blur(12px)",
    "& .icon": {
      color: colors.icon,
    },
  };
}

/**
 * Generate badge styles based on variant
 */
export function getBadgeStyles(
  variant: "primary" | "secondary" | "mystic" | "success" | "error" = "primary"
) {
  const colors = BADGE_COLORS[variant];

  return {
    background: colors.bg,
    color: colors.text,
    boxShadow: colors.shadow,
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  };
}

/**
 * Generate link styles
 */
export function getLinkStyles() {
  return {
    color: LINK_COLORS.default,
    textDecoration: "none",
    borderBottom: `1px solid ${LINK_COLORS.underlineColor}`,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      color: LINK_COLORS.hover,
      borderBottomColor: LINK_COLORS.hover,
    },
    "&:active": {
      color: LINK_COLORS.active,
    },
    "&:visited": {
      color: LINK_COLORS.visited,
    },
  };
}

// ============================================
// 🎭 ANIMATION UTILITIES
// ============================================

/**
 * Generate fade-in animation styles
 */
export function fadeInAnimation(duration: number = 350, delay: number = 0) {
  return {
    animation: `fadeIn ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards`,
    opacity: 0,
  };
}

/**
 * Generate slide-up animation styles
 */
export function slideUpAnimation(duration: number = 350, delay: number = 0) {
  return {
    animation: `slideUp ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms forwards`,
    opacity: 0,
    transform: "translateY(20px)",
  };
}

/**
 * Generate glow pulse animation styles
 */
export function glowPulseAnimation() {
  return {
    animation: "glowPulse 2s ease-in-out infinite",
  };
}

/**
 * Generate hover lift effect
 */
export function hoverLiftEffect(translateY: number = -4) {
  return {
    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: `translateY(${translateY}px)`,
      boxShadow: SHADOWS.cardElevated,
    },
  };
}

// ============================================
// 🌈 GRADIENT UTILITIES
// ============================================

/**
 * Create a custom linear gradient
 */
export function createLinearGradient(
  angle: number,
  colorStops: Array<{ color: string; position: number }>
): string {
  const stops = colorStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");
  return `linear-gradient(${angle}deg, ${stops})`;
}

/**
 * Create a radial gradient
 */
export function createRadialGradient(
  colorStops: Array<{ color: string; position: number }>
): string {
  const stops = colorStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");
  return `radial-gradient(circle, ${stops})`;
}

/**
 * Apply text gradient
 */
export function textGradient(gradient: string) {
  return {
    background: gradient,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
  };
}

/**
 * Apply border gradient (requires pseudo-element)
 */
export function borderGradient(gradient: string, borderWidth: number = 2) {
  return {
    position: "relative" as const,
    border: `${borderWidth}px solid transparent`,
    backgroundClip: "padding-box",
    "&::before": {
      content: '""',
      position: "absolute" as const,
      inset: 0,
      zIndex: -1,
      margin: `-${borderWidth}px`,
      borderRadius: "inherit",
      background: gradient,
    },
  };
}

// ============================================
// 💫 GLASSMORPHISM UTILITIES
// ============================================

/**
 * Create glassmorphism effect
 */
export function glassmorphism(
  blur: number = 12,
  opacity: number = 0.1,
  borderOpacity: number = 0.1
) {
  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    boxShadow: SHADOWS.lg,
  };
}

/**
 * Create dark glassmorphism effect
 */
export function darkGlassmorphism(
  blur: number = 12,
  opacity: number = 0.4
) {
  return {
    background: `rgba(27, 58, 93, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(79, 209, 255, 0.2)`,
    boxShadow: SHADOWS.lg,
  };
}

// ============================================
// 🎯 RESPONSIVE UTILITIES
// ============================================

/**
 * Breakpoint utilities
 */
export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * Media query helper
 */
export function mediaQuery(breakpoint: keyof typeof breakpoints) {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
}

// ============================================
// 🎨 THEME OBJECT (for CSS-in-JS libraries)
// ============================================

/**
 * Complete theme object for use with styled-components, emotion, etc.
 */
export const theme = {
  colors: COLORS,
  gradients: GRADIENTS,
  shadows: SHADOWS,
  opacity: OPACITY,
  button: BUTTON_COLORS,
  card: CARD_COLORS,
  input: INPUT_COLORS,
  toast: TOAST_COLORS,
  badge: BADGE_COLORS,
  link: LINK_COLORS,
  divider: DIVIDER_COLORS,
  breakpoints,
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "350ms cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
  fonts: {
    heading: "'Sora', 'Cinzel', 'Playfair Display', serif",
    body: "'Inter', 'Manrope', system-ui, -apple-system, sans-serif",
    mono: "'Fira Code', 'JetBrains Mono', monospace",
  },
  borderRadius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    full: "9999px",
  },
} as const;

export type Theme = typeof theme;

// ============================================
// 📦 EXPORT UTILITIES
// ============================================

export {
  COLORS,
  GRADIENTS,
  SHADOWS,
  BUTTON_COLORS,
  CARD_COLORS,
  INPUT_COLORS,
  TOAST_COLORS,
  BADGE_COLORS,
  LINK_COLORS,
  DIVIDER_COLORS,
  OPACITY,
};

