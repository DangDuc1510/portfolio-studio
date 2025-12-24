/**
 * FANTASY PORTFOLIO COLOR SYSTEM
 * Theme: Midnight Fantasy - Huyền ảo, thanh thoát, cao cấp
 *
 * Color Philosophy:
 * - Deep navy backgrounds for depth and mystery
 * - Cyan/Azure for energy and magic
 * - Purple for creativity and fantasy
 * - Gold for luxury CTAs
 * - Ice white for clarity
 */

// ============================================
// 🎨 PRIMARY COLORS - Core Background System
// ============================================
export const PRIMARY_COLORS = {
  // Main backgrounds
  midnight: "#0B132B", // Body background - deepest depth
  navy: "#0F1C3F", // Section backgrounds
  moonlight: "#1B3A5D", // Cards, panels, elevated surfaces

  // Variations for depth
  midnightLight: "#0D1632", // Slightly lighter midnight
  navyDark: "#0C1630", // Darker navy for contrast
  moonlightLight: "#234A73", // Lighter moonlight for hover states
} as const;

// ============================================
// 🌊 ACCENT COLORS - Fantasy Energy System
// ============================================
export const ACCENT_COLORS = {
  // Cyan family - Primary interactive elements
  spiritCyan: "#4FD1FF", // Links, highlights, primary hover
  azure: "#2EC4FF", // Icons, active states, focus rings
  cyanDark: "#1BA5D9", // Pressed states
  cyanLight: "#7FDDFF", // Lighter hover states

  // Purple family - Creative & magical elements
  mystic: "#6C63FF", // Creative accents, special badges
  mysticDark: "#5449E6", // Darker purple for depth
  mysticLight: "#8B84FF", // Lighter purple for glow

  // Teal blend - Transitional colors
  aquaMystic: "#3FA8D9", // Blend between cyan and purple
} as const;

// ============================================
// 🌟 LUXURY HIGHLIGHT - CTA & Premium Elements
// ============================================
export const LUXURY_COLORS = {
  // Gold family - CTAs, premium features
  golden: "#F6C177", // Primary CTA buttons
  softGold: "#FFD88A", // Hover states, badges
  richGold: "#E5A94F", // Pressed states, deep gold
  paleGold: "#FFE5B3", // Subtle highlights

  // Amber accents
  amber: "#FFA94D", // Warning states with luxury feel
  amberLight: "#FFBC73", // Lighter amber
} as const;

// ============================================
// 🧊 NEUTRAL & TEXT SYSTEM
// ============================================
export const NEUTRAL_COLORS = {
  // White spectrum
  pureWhite: "#FFFFFF", // Headings, important text
  iceWhite: "#EAF6FF", // Body text, readable content
  frostWhite: "#D4E9F7", // Secondary text

  // Blue-gray spectrum
  mutedBlue: "#8FAFC7", // Tertiary text, placeholders
  slateBlue: "#6B8BA3", // Disabled text
  deepSlate: "#4A6B82", // Borders, dividers (subtle)

  // Pure grays (minimal use)
  lightGray: "#C5D5E0", // Alternative borders
  midGray: "#7A8FA3", // Alternative muted text
} as const;

// ============================================
// 🎯 SEMANTIC COLORS - Status & Feedback
// ============================================
export const SEMANTIC_COLORS = {
  // Success - with fantasy twist
  success: "#4FFFB0", // Bright success green with cyan tint
  successDark: "#2EE69A", // Darker success
  successLight: "#7FFFC7", // Lighter success
  successBg: "rgba(79, 255, 176, 0.1)", // Success background

  // Error - vibrant but not harsh
  error: "#FF6B9D", // Pink-red error (softer than pure red)
  errorDark: "#E6527D", // Darker error
  errorLight: "#FF8FB3", // Lighter error
  errorBg: "rgba(255, 107, 157, 0.1)", // Error background

  // Warning - using luxury gold
  warning: "#FFB84D", // Warm warning
  warningDark: "#E69A2E", // Darker warning
  warningLight: "#FFCC7F", // Lighter warning
  warningBg: "rgba(255, 184, 77, 0.1)", // Warning background

  // Info - using spirit cyan
  info: "#4FD1FF", // Info (same as spiritCyan)
  infoDark: "#2EC4FF", // Darker info
  infoLight: "#7FDDFF", // Lighter info
  infoBg: "rgba(79, 209, 255, 0.1)", // Info background
} as const;

// ============================================
// 🌈 GRADIENT DEFINITIONS
// ============================================
export const GRADIENTS = {
  // Background gradients
  heroBackground:
    "linear-gradient(135deg, #0B132B 0%, #0F1C3F 40%, #1B3A5D 100%)",
  sectionBackground: "linear-gradient(180deg, #0F1C3F 0%, #0B132B 100%)",
  cardBackground: "linear-gradient(135deg, #1B3A5D 0%, #0F1C3F 100%)",

  // Fantasy glow gradients
  fantasyGlow: "linear-gradient(120deg, #2EC4FF 0%, #6C63FF 50%, #4FD1FF 100%)",
  cyanGlow: "linear-gradient(135deg, #4FD1FF 0%, #2EC4FF 100%)",
  purpleGlow: "linear-gradient(135deg, #8B84FF 0%, #6C63FF 100%)",

  // CTA button gradients
  ctaPrimary: "linear-gradient(135deg, #FFD88A 0%, #F6C177 50%, #E5A94F 100%)",
  ctaHover: "linear-gradient(135deg, #FFE5B3 0%, #FFD88A 50%, #F6C177 100%)",
  ctaPressed: "linear-gradient(135deg, #F6C177 0%, #E5A94F 50%, #D4984A 100%)",

  // Secondary button gradients
  secondaryCyan:
    "linear-gradient(135deg, #7FDDFF 0%, #4FD1FF 50%, #2EC4FF 100%)",
  secondaryPurple:
    "linear-gradient(135deg, #8B84FF 0%, #6C63FF 50%, #5449E6 100%)",

  // Glassmorphism
  glassLight:
    "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
  glassDark: "linear-gradient(180deg, rgba(27,58,93,0.4), rgba(15,28,63,0.2))",
  glassCard:
    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",

  // Border gradients
  borderCyan: "linear-gradient(135deg, #4FD1FF 0%, #2EC4FF 100%)",
  borderPurple: "linear-gradient(135deg, #6C63FF 0%, #5449E6 100%)",
  borderGold: "linear-gradient(135deg, #FFD88A 0%, #F6C177 100%)",
  borderFantasy:
    "linear-gradient(135deg, #2EC4FF 0%, #6C63FF 50%, #4FD1FF 100%)",

  // Text gradients
  textGold: "linear-gradient(135deg, #FFD88A 0%, #F6C177 100%)",
  textCyan: "linear-gradient(135deg, #7FDDFF 0%, #4FD1FF 100%)",
  textFantasy: "linear-gradient(120deg, #4FD1FF 0%, #6C63FF 50%, #FFD88A 100%)",
} as const;

// ============================================
// 💫 SHADOW & GLOW EFFECTS
// ============================================
export const SHADOWS = {
  // Standard shadows
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",

  // Glow effects - signature fantasy look
  glowCyan:
    "0 0 20px rgba(79, 209, 255, 0.3), 0 0 40px rgba(79, 209, 255, 0.15)",
  glowCyanStrong:
    "0 0 30px rgba(79, 209, 255, 0.5), 0 0 60px rgba(79, 209, 255, 0.25)",
  glowPurple:
    "0 0 20px rgba(108, 99, 255, 0.3), 0 0 40px rgba(108, 99, 255, 0.15)",
  glowGold:
    "0 0 20px rgba(246, 193, 119, 0.3), 0 0 40px rgba(246, 193, 119, 0.15)",
  glowWhite:
    "0 0 15px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)",

  // Inner shadows
  innerDark: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
  innerLight: "inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)",

  // Combined shadow + glow
  cardElevated:
    "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
  buttonGlow:
    "0 4px 12px rgba(246, 193, 119, 0.3), 0 0 20px rgba(246, 193, 119, 0.2)",
} as const;

// ============================================
// 🎭 OPACITY SCALES
// ============================================
export const OPACITY = {
  // Standard opacity
  0: "0",
  5: "0.05",
  10: "0.1",
  15: "0.15",
  20: "0.2",
  25: "0.25",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  80: "0.8",
  90: "0.9",
  95: "0.95",
  100: "1",
} as const;

// ============================================
// 🎨 COMPONENT-SPECIFIC COLOR MAPPINGS
// ============================================

// Button colors
export const BUTTON_COLORS = {
  // Primary button (Gold CTA)
  primary: {
    bg: LUXURY_COLORS.golden,
    bgHover: LUXURY_COLORS.softGold,
    bgPressed: LUXURY_COLORS.richGold,
    text: PRIMARY_COLORS.midnight,
    textHover: PRIMARY_COLORS.midnight,
    border: "transparent",
    shadow: SHADOWS.buttonGlow,
    gradient: GRADIENTS.ctaPrimary,
    gradientHover: GRADIENTS.ctaHover,
  },

  // Secondary button (Cyan)
  secondary: {
    bg: ACCENT_COLORS.spiritCyan,
    bgHover: ACCENT_COLORS.cyanLight,
    bgPressed: ACCENT_COLORS.cyanDark,
    text: PRIMARY_COLORS.midnight,
    textHover: PRIMARY_COLORS.midnight,
    border: "transparent",
    shadow: SHADOWS.glowCyan,
    gradient: GRADIENTS.secondaryCyan,
  },

  // Ghost button (Outlined)
  ghost: {
    bg: "transparent",
    bgHover: `rgba(79, 209, 255, ${OPACITY[10]})`,
    bgPressed: `rgba(79, 209, 255, ${OPACITY[20]})`,
    text: ACCENT_COLORS.spiritCyan,
    textHover: ACCENT_COLORS.cyanLight,
    border: ACCENT_COLORS.spiritCyan,
    borderHover: ACCENT_COLORS.cyanLight,
    shadow: "none",
  },

  // Text button
  text: {
    bg: "transparent",
    bgHover: `rgba(79, 209, 255, ${OPACITY[10]})`,
    text: ACCENT_COLORS.spiritCyan,
    textHover: ACCENT_COLORS.cyanLight,
    border: "transparent",
  },

  // Danger button
  danger: {
    bg: SEMANTIC_COLORS.error,
    bgHover: SEMANTIC_COLORS.errorLight,
    bgPressed: SEMANTIC_COLORS.errorDark,
    text: NEUTRAL_COLORS.pureWhite,
    border: "transparent",
  },

  // Disabled state (all buttons)
  disabled: {
    bg: PRIMARY_COLORS.moonlight,
    text: NEUTRAL_COLORS.slateBlue,
    border: NEUTRAL_COLORS.deepSlate,
    opacity: OPACITY[50],
  },
} as const;

// Card colors
export const CARD_COLORS = {
  // Standard card
  standard: {
    bg: PRIMARY_COLORS.moonlight,
    bgGradient: GRADIENTS.cardBackground,
    border: `rgba(79, 209, 255, ${OPACITY[20]})`,
    shadow: SHADOWS.md,
  },

  // Glass card
  glass: {
    bg: `rgba(27, 58, 93, ${OPACITY[40]})`,
    bgGradient: GRADIENTS.glassCard,
    border: `rgba(255, 255, 255, ${OPACITY[10]})`,
    shadow: SHADOWS.lg,
    backdrop: "blur(12px)",
  },

  // Elevated card (hover state)
  elevated: {
    bg: PRIMARY_COLORS.moonlightLight,
    border: `rgba(79, 209, 255, ${OPACITY[40]})`,
    shadow: SHADOWS.cardElevated,
  },

  // Featured card (with glow)
  featured: {
    bg: PRIMARY_COLORS.moonlight,
    bgGradient: GRADIENTS.cardBackground,
    border: ACCENT_COLORS.spiritCyan,
    borderGradient: GRADIENTS.borderFantasy,
    shadow: SHADOWS.glowCyanStrong,
  },
} as const;

// Input/Form colors
export const INPUT_COLORS = {
  bg: PRIMARY_COLORS.moonlight,
  bgFocus: PRIMARY_COLORS.moonlightLight,
  bgDisabled: PRIMARY_COLORS.navy,

  text: NEUTRAL_COLORS.iceWhite,
  placeholder: NEUTRAL_COLORS.mutedBlue,
  textDisabled: NEUTRAL_COLORS.slateBlue,

  border: NEUTRAL_COLORS.deepSlate,
  borderHover: ACCENT_COLORS.spiritCyan,
  borderFocus: ACCENT_COLORS.azure,
  borderError: SEMANTIC_COLORS.error,

  shadow: SHADOWS.sm,
  shadowFocus: SHADOWS.glowCyan,
} as const;

// Toast/Notification colors
export const TOAST_COLORS = {
  success: {
    bg: `rgba(79, 255, 176, ${OPACITY[15]})`,
    border: SEMANTIC_COLORS.success,
    icon: SEMANTIC_COLORS.success,
    text: NEUTRAL_COLORS.iceWhite,
    shadow: `0 0 20px rgba(79, 255, 176, ${OPACITY[20]})`,
  },
  error: {
    bg: `rgba(255, 107, 157, ${OPACITY[15]})`,
    border: SEMANTIC_COLORS.error,
    icon: SEMANTIC_COLORS.error,
    text: NEUTRAL_COLORS.iceWhite,
    shadow: `0 0 20px rgba(255, 107, 157, ${OPACITY[20]})`,
  },
  warning: {
    bg: `rgba(255, 184, 77, ${OPACITY[15]})`,
    border: SEMANTIC_COLORS.warning,
    icon: SEMANTIC_COLORS.warning,
    text: NEUTRAL_COLORS.iceWhite,
    shadow: `0 0 20px rgba(255, 184, 77, ${OPACITY[20]})`,
  },
  info: {
    bg: `rgba(79, 209, 255, ${OPACITY[15]})`,
    border: SEMANTIC_COLORS.info,
    icon: SEMANTIC_COLORS.info,
    text: NEUTRAL_COLORS.iceWhite,
    shadow: SHADOWS.glowCyan,
  },
} as const;

// Badge colors
export const BADGE_COLORS = {
  primary: {
    bg: LUXURY_COLORS.softGold,
    text: PRIMARY_COLORS.midnight,
    shadow: SHADOWS.glowGold,
  },
  secondary: {
    bg: ACCENT_COLORS.spiritCyan,
    text: PRIMARY_COLORS.midnight,
    shadow: SHADOWS.glowCyan,
  },
  mystic: {
    bg: ACCENT_COLORS.mystic,
    text: NEUTRAL_COLORS.pureWhite,
    shadow: SHADOWS.glowPurple,
  },
  success: {
    bg: SEMANTIC_COLORS.success,
    text: PRIMARY_COLORS.midnight,
  },
  error: {
    bg: SEMANTIC_COLORS.error,
    text: NEUTRAL_COLORS.pureWhite,
  },
} as const;

// Link colors
export const LINK_COLORS = {
  default: ACCENT_COLORS.spiritCyan,
  hover: ACCENT_COLORS.cyanLight,
  active: ACCENT_COLORS.cyanDark,
  visited: ACCENT_COLORS.mystic,
  underlineColor: `rgba(79, 209, 255, ${OPACITY[30]})`,
} as const;

// Divider colors
export const DIVIDER_COLORS = {
  default: `rgba(79, 209, 255, ${OPACITY[20]})`,
  subtle: `rgba(143, 175, 199, ${OPACITY[15]})`,
  strong: `rgba(79, 209, 255, ${OPACITY[40]})`,
  gradient: GRADIENTS.borderFantasy,
} as const;

// ============================================
// 📦 EXPORT ALL COLORS
// ============================================
export const COLORS = {
  ...PRIMARY_COLORS,
  ...ACCENT_COLORS,
  ...LUXURY_COLORS,
  ...NEUTRAL_COLORS,
  ...SEMANTIC_COLORS,
} as const;

// Export type for TypeScript
export type ColorKey = keyof typeof COLORS;
export type GradientKey = keyof typeof GRADIENTS;
export type ShadowKey = keyof typeof SHADOWS;
