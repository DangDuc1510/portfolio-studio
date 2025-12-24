// API Runtime Configuration
export const API_RUNTIME = "nodejs" as const;
export const API_MAX_DURATION = 30; // seconds

// Pagination Defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_ORDER = "desc" as const;

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 10 * 1024 * 1024;//50mb
export const ALLOWED_IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
] as const;
export const CLOUDINARY_FOLDER = "portfolio-studio";
export const CLOUDINARY_RESOURCE_TYPE = "image" as const;
export const CLOUDINARY_QUALITY = "auto" as const;
export const CLOUDINARY_FETCH_FORMAT = "auto" as const;

// Stats Configuration
export const STATS_DAYS_BACK = 30;
export const TOP_ALBUMS_LIMIT = 10;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_ID: (entityName: string, id: string) =>
    `Invalid ${entityName} ID: ${id}`,
  NOT_FOUND: (entityName: string) => `${entityName} not found`,
  NO_FILE_UPLOADED: "No file uploaded",
  INVALID_FILE_TYPE: "Only image files are allowed!",
  FILE_SIZE_EXCEEDED: "File size exceeds 10MB limit",
  CLOUDINARY_CONFIG_MISSING:
    "Cloudinary configuration is missing. Please check your environment variables.",
  CLOUDINARY_AUTH_FAILED:
    "Authentication failed. Please check your Cloudinary credentials.",
  CLOUDINARY_INVALID_SIGNATURE:
    "Invalid Signature error usually indicates incorrect CLOUDINARY_API_SECRET. Please verify your API secret in the Cloudinary dashboard.",
  CLOUDINARY_INVALID_UPLOAD: "Invalid upload request",
  CLOUDINARY_UPLOAD_FAILED: "Upload failed",
  URL_OR_PUBLIC_ID_REQUIRED: "URL or publicId is required",
  COULD_NOT_EXTRACT_PUBLIC_ID: "Could not extract public ID from URL",
  MONGODB_CONNECTION_FAILED: "MongoDB connection failed",
  FAILED_TO_FETCH: (entityName: string) => `Failed to fetch ${entityName}`,
  FAILED_TO_CREATE: (entityName: string) => `Failed to create ${entityName}`,
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: "File uploaded successfully",
  FILE_DELETED: "File deleted successfully",
  FILE_NOT_FOUND: "File not found or could not be deleted",
} as const;

// Ant Design Theme Configuration - Fantasy Portfolio Theme
export const ANT_DESIGN_THEME = {
  token: {
    // Primary colors
    colorPrimary: "#4FD1FF", // Spirit Cyan - main interactive color
    colorSuccess: "#4FFFB0", // Success green with cyan tint
    colorWarning: "#FFB84D", // Warm warning
    colorError: "#FF6B9D", // Pink-red error (softer)
    colorInfo: "#4FD1FF", // Info (same as primary)

    // Background colors
    colorBgContainer: "#1B3A5D", // Moonlight - cards, panels
    colorBgElevated: "#234A73", // Moonlight light - elevated surfaces
    colorBgLayout: "#0F1C3F", // Navy - section backgrounds
    colorBgBase: "#0B132B", // Midnight - body background
    colorBgSpotlight: "#0F1C3F", // Navy for spotlight

    // Text colors
    colorText: "#EAF6FF", // Ice white - body text
    colorTextHeading: "#FFFFFF", // Pure white - headings
    colorTextSecondary: "#8FAFC7", // Muted blue - secondary text
    colorTextTertiary: "#6B8BA3", // Slate blue - tertiary text
    colorTextQuaternary: "#4A6B82", // Deep slate - quaternary text
    colorTextPlaceholder: "#8FAFC7", // Muted blue - placeholders
    colorTextDisabled: "#6B8BA3", // Slate blue - disabled text

    // Border colors
    colorBorder: "#4A6B82", // Deep slate - default borders
    colorBorderSecondary: "rgba(79, 209, 255, 0.2)", // Cyan with opacity

    // Link colors
    colorLink: "#4FD1FF", // Spirit cyan
    colorLinkHover: "#7FDDFF", // Cyan light
    colorLinkActive: "#2EC4FF", // Azure

    // Shadow
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    boxShadowSecondary:
      "0 0 20px rgba(79, 209, 255, 0.3), 0 0 40px rgba(79, 209, 255, 0.15)",

    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // Font
    fontFamily: "'Inter', 'Manrope', system-ui, -apple-system, sans-serif",
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Motion
    motionDurationSlow: "0.35s",
    motionDurationMid: "0.25s",
    motionDurationFast: "0.15s",
  },

  components: {
    // Button component
    Button: {
      // Primary button (Gold CTA)
      colorPrimary: "#F6C177",
      colorPrimaryHover: "#FFD88A",
      colorPrimaryActive: "#E5A94F",
      colorPrimaryBorder: "#F6C177",
      primaryShadow:
        "0 4px 12px rgba(246, 193, 119, 0.3), 0 0 20px rgba(246, 193, 119, 0.2)",

      // Default button (Cyan)
      defaultBg: "#1B3A5D",
      defaultColor: "#4FD1FF",
      defaultBorderColor: "rgba(79, 209, 255, 0.3)",
      defaultHoverBg: "rgba(79, 209, 255, 0.1)",
      defaultHoverColor: "#7FDDFF",
      defaultHoverBorderColor: "#4FD1FF",
      defaultActiveBg: "rgba(79, 209, 255, 0.2)",
      defaultActiveBorderColor: "#2EC4FF",

      // Danger button
      colorError: "#FF6B9D",
      colorErrorHover: "#FF8FB3",
      colorErrorActive: "#E6527D",
      dangerShadow: "0 0 15px rgba(255, 107, 157, 0.2)",

      // Text button
      colorText: "#4FD1FF",
      colorTextHover: "#7FDDFF",

      // Link button
      colorLink: "#4FD1FF",
      colorLinkHover: "#7FDDFF",
      colorLinkActive: "#2EC4FF",

      // Ghost button
      ghostBg: "transparent",
      ghostColor: "#4FD1FF",

      // Disabled
      colorBgContainerDisabled: "#0F1C3F",
      colorTextDisabled: "#6B8BA3",
      borderColorDisabled: "#4A6B82",
    },

    // Input component
    Input: {
      colorBgContainer: "#1B3A5D",
      colorBorder: "#4A6B82",
      colorText: "#EAF6FF",
      colorTextPlaceholder: "#8FAFC7",
      colorTextDisabled: "#6B8BA3",
      colorBgContainerDisabled: "#0F1C3F",

      // Focus state
      activeBorderColor: "#4FD1FF",
      activeShadow: "0 0 20px rgba(79, 209, 255, 0.3)",
      hoverBorderColor: "#4FD1FF",

      // Error state
      colorError: "#FF6B9D",
      colorErrorBorderHover: "#FF8FB3",
    },

    // Select component
    Select: {
      colorBgContainer: "#1B3A5D",
      colorBgElevated: "#234A73",
      colorBorder: "#4A6B82",
      colorText: "#EAF6FF",
      colorTextPlaceholder: "#8FAFC7",

      selectorBg: "#1B3A5D",
      optionSelectedBg: "rgba(79, 209, 255, 0.2)",
      optionActiveBg: "rgba(79, 209, 255, 0.1)",
      optionSelectedColor: "#7FDDFF",

      // Dropdown items
      controlItemBgActive: "rgba(79, 209, 255, 0.15)",
      controlItemBgHover: "rgba(79, 209, 255, 0.1)",
    },

    // Switch component
    Switch: {
      colorPrimary: "#F6C177", // Gold for active state
      colorPrimaryHover: "#FFD88A",
      colorTextQuaternary: "#0F1C3F", // Track background (off)
      colorTextTertiary: "#1B3A5D", // Track background hover
      handleBg: "#FFFFFF",
      handleShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    },

    // Checkbox & Radio
    Checkbox: {
      colorPrimary: "#4FD1FF",
      colorPrimaryHover: "#7FDDFF",
      colorBorder: "#4A6B82",
      colorBgContainer: "#1B3A5D",
    },

    Radio: {
      colorPrimary: "#4FD1FF",
      colorPrimaryHover: "#7FDDFF",
      colorBorder: "#4A6B82",
      colorBgContainer: "#1B3A5D",
    },

    // Card component
    Card: {
      colorBgContainer: "#1B3A5D",
      colorBorderSecondary: "rgba(79, 209, 255, 0.2)",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
      boxShadowTertiary:
        "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
    },

    // Modal component
    Modal: {
      contentBg: "#1B3A5D",
      headerBg: "#234A73",
      footerBg: "#1B3A5D",
      colorText: "#EAF6FF",
      colorTextHeading: "#FFFFFF",
      colorBorder: "rgba(79, 209, 255, 0.2)",
      boxShadow:
        "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(79, 209, 255, 0.2)",
    },

    // Drawer component
    Drawer: {
      colorBgElevated: "#1B3A5D",
      colorText: "#EAF6FF",
      colorBorder: "rgba(79, 209, 255, 0.2)",
    },

    // Table component
    Table: {
      colorBgContainer: "#1B3A5D",
      colorText: "#EAF6FF",
      colorTextHeading: "#FFFFFF",
      colorBorderSecondary: "rgba(79, 209, 255, 0.15)",
      rowHoverBg: "rgba(79, 209, 255, 0.05)",
      rowSelectedBg: "rgba(79, 209, 255, 0.1)",
      rowSelectedHoverBg: "rgba(79, 209, 255, 0.15)",
      headerBg: "#0F1C3F",
      headerColor: "#FFFFFF",
      headerSortActiveBg: "rgba(79, 209, 255, 0.1)",
      fixedHeaderSortActiveBg: "rgba(79, 209, 255, 0.15)",
    },

    // Dropdown component
    Dropdown: {
      colorBgElevated: "#234A73",
      colorText: "#EAF6FF",
      controlItemBgActive: "rgba(79, 209, 255, 0.15)",
      controlItemBgHover: "rgba(79, 209, 255, 0.1)",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
    },

    // Menu component
    Menu: {
      colorBgContainer: "#1B3A5D",
      colorItemBg: "transparent",
      colorItemBgHover: "rgba(79, 209, 255, 0.1)",
      colorItemBgActive: "rgba(79, 209, 255, 0.15)",
      colorItemBgSelected: "rgba(79, 209, 255, 0.2)",
      colorItemText: "#EAF6FF",
      colorItemTextHover: "#7FDDFF",
      colorItemTextSelected: "#4FD1FF",
      colorItemTextActive: "#4FD1FF",
      colorActiveBarBorderSize: 3,
      itemActiveBg: "rgba(79, 209, 255, 0.15)",
      itemSelectedBg: "rgba(79, 209, 255, 0.2)",
      itemSelectedColor: "#4FD1FF",
    },

    // Tabs component
    Tabs: {
      colorBgContainer: "#1B3A5D",
      colorText: "#8FAFC7",
      colorPrimary: "#4FD1FF",
      itemColor: "#8FAFC7",
      itemHoverColor: "#7FDDFF",
      itemSelectedColor: "#4FD1FF",
      itemActiveColor: "#4FD1FF",
      inkBarColor: "#4FD1FF",
      cardBg: "#1B3A5D",
      cardGutter: 8,
    },

    // Tag component
    Tag: {
      defaultBg: "rgba(79, 209, 255, 0.1)",
      defaultColor: "#4FD1FF",
    },

    // Badge component
    Badge: {
      colorBgContainer: "#F6C177",
      colorText: "#0B132B",
      textFontSize: 12,
      textFontWeight: 600,
    },

    // Tooltip component
    Tooltip: {
      colorBgSpotlight: "#234A73",
      colorTextLightSolid: "#EAF6FF",
      boxShadow:
        "0 4px 12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(79, 209, 255, 0.2)",
    },

    // Popover component
    Popover: {
      colorBgElevated: "#234A73",
      colorText: "#EAF6FF",
      colorBorder: "rgba(79, 209, 255, 0.2)",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
    },

    // Message component
    Message: {
      contentBg: "#234A73",
      contentPadding: "12px 16px",
      boxShadow:
        "0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
    },

    // Notification component
    Notification: {
      colorBgElevated: "#234A73",
      colorText: "#EAF6FF",
      colorTextHeading: "#FFFFFF",
      colorIcon: "#4FD1FF",
      colorIconHover: "#7FDDFF",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
    },

    // Progress component
    Progress: {
      defaultColor: "#4FD1FF",
      remainingColor: "rgba(79, 209, 255, 0.15)",
      circleTextColor: "#EAF6FF",
    },

    // Slider component
    Slider: {
      trackBg: "rgba(79, 209, 255, 0.2)",
      trackHoverBg: "rgba(79, 209, 255, 0.3)",
      railBg: "rgba(79, 209, 255, 0.1)",
      railHoverBg: "rgba(79, 209, 255, 0.15)",
      handleColor: "#4FD1FF",
      handleActiveColor: "#7FDDFF",
      dotBorderColor: "#4FD1FF",
      dotActiveBorderColor: "#7FDDFF",
    },

    // Pagination component
    Pagination: {
      colorBgContainer: "#1B3A5D",
      colorPrimary: "#4FD1FF",
      colorPrimaryHover: "#7FDDFF",
      itemActiveBg: "rgba(79, 209, 255, 0.2)",
      itemBg: "#1B3A5D",
      itemLinkBg: "#1B3A5D",
      itemInputBg: "#1B3A5D",
    },

    // Divider component
    Divider: {
      colorSplit: "rgba(79, 209, 255, 0.2)",
      colorText: "#8FAFC7",
      colorTextHeading: "#EAF6FF",
    },

    // Spin component
    Spin: {
      colorPrimary: "#4FD1FF",
      dotSize: 20,
      dotSizeSM: 14,
      dotSizeLG: 32,
    },

    // Alert component
    Alert: {
      colorInfoBg: "rgba(79, 209, 255, 0.15)",
      colorInfoBorder: "#4FD1FF",
      colorSuccessBg: "rgba(79, 255, 176, 0.15)",
      colorSuccessBorder: "#4FFFB0",
      colorWarningBg: "rgba(255, 184, 77, 0.15)",
      colorWarningBorder: "#FFB84D",
      colorErrorBg: "rgba(255, 107, 157, 0.15)",
      colorErrorBorder: "#FF6B9D",
      colorText: "#EAF6FF",
      colorTextHeading: "#FFFFFF",
    },

    // DatePicker component
    DatePicker: {
      colorBgContainer: "#1B3A5D",
      colorBgElevated: "#234A73",
      colorText: "#EAF6FF",
      colorTextHeading: "#FFFFFF",
      colorTextPlaceholder: "#8FAFC7",
      colorPrimary: "#4FD1FF",
      colorBorder: "#4A6B82",
      cellHoverBg: "rgba(79, 209, 255, 0.1)",
      cellActiveWithRangeBg: "rgba(79, 209, 255, 0.15)",
      cellRangeBorderColor: "#4FD1FF",
    },

    // Upload component
    Upload: {
      colorBorder: "rgba(79, 209, 255, 0.3)",
      colorBorderHover: "#4FD1FF",
      colorFillAlter: "rgba(79, 209, 255, 0.05)",
      colorText: "#EAF6FF",
      colorTextHeading: "#FFFFFF",
    },

    // Form component
    Form: {
      labelColor: "#EAF6FF",
      labelRequiredMarkColor: "#FF6B9D",
      labelFontSize: 14,
      itemMarginBottom: 24,
    },
  },
} as const;
