/**
 * SONNER TOAST THEME CONFIGURATION
 * Custom theme for Sonner toast notifications matching the Fantasy Portfolio design
 */

import { TOAST_COLORS, COLORS } from "@/constants/colors";
import { toast } from "sonner";

/**
 * Sonner toast custom styles
 * Use these with the Toaster component or individual toast calls
 */
export const sonnerToastStyles = {
  // Success toast
  success: {
    background: TOAST_COLORS.success.bg,
    border: `1px solid ${TOAST_COLORS.success.border}`,
    color: TOAST_COLORS.success.text,
    boxShadow: TOAST_COLORS.success.shadow,
    backdropFilter: "blur(12px)",
  },

  // Error toast
  error: {
    background: TOAST_COLORS.error.bg,
    border: `1px solid ${TOAST_COLORS.error.border}`,
    color: TOAST_COLORS.error.text,
    boxShadow: TOAST_COLORS.error.shadow,
    backdropFilter: "blur(12px)",
  },

  // Warning toast
  warning: {
    background: TOAST_COLORS.warning.bg,
    border: `1px solid ${TOAST_COLORS.warning.border}`,
    color: TOAST_COLORS.warning.text,
    boxShadow: TOAST_COLORS.warning.shadow,
    backdropFilter: "blur(12px)",
  },

  // Info toast
  info: {
    background: TOAST_COLORS.info.bg,
    border: `1px solid ${TOAST_COLORS.info.border}`,
    color: TOAST_COLORS.info.text,
    boxShadow: TOAST_COLORS.info.shadow,
    backdropFilter: "blur(12px)",
  },

  // Default toast
  default: {
    background: "rgba(27, 58, 93, 0.9)",
    border: `1px solid rgba(79, 209, 255, 0.2)`,
    color: COLORS.iceWhite,
    boxShadow:
      "0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
    backdropFilter: "blur(12px)",
  },
} as const;

/**
 * Sonner Toaster component props for global configuration
 *
 * Usage in your layout or app component:
 *
 * import { Toaster } from 'sonner';
 * import { sonnerTheme } from '@/utils/sonner-theme';
 *
 * <Toaster {...sonnerTheme} />
 */
export const sonnerTheme = {
  position: "top-right" as const,
  expand: true,
  richColors: false,
  closeButton: true,
  duration: 4000,

  // Custom styles for all toasts
  toastOptions: {
    style: {
      background: "rgba(27, 58, 93, 0.9)",
      border: "1px solid rgba(79, 209, 255, 0.2)",
      color: COLORS.iceWhite,
      backdropFilter: "blur(12px)",
      boxShadow:
        "0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(79, 209, 255, 0.15)",
      fontSize: "14px",
      fontFamily: "'Inter', 'Manrope', system-ui, -apple-system, sans-serif",
      borderRadius: "12px",
      padding: "16px",
    },

    // Success toast styles
    success: {
      style: sonnerToastStyles.success,
      iconTheme: {
        primary: TOAST_COLORS.success.icon,
        secondary: COLORS.midnight,
      },
    },

    // Error toast styles
    error: {
      style: sonnerToastStyles.error,
      iconTheme: {
        primary: TOAST_COLORS.error.icon,
        secondary: COLORS.midnight,
      },
    },

    // Warning toast styles
    warning: {
      style: sonnerToastStyles.warning,
      iconTheme: {
        primary: TOAST_COLORS.warning.icon,
        secondary: COLORS.midnight,
      },
    },

    // Info toast styles
    info: {
      style: sonnerToastStyles.info,
      iconTheme: {
        primary: TOAST_COLORS.info.icon,
        secondary: COLORS.midnight,
      },
    },

    // Loading toast styles
    loading: {
      style: {
        background: "rgba(27, 58, 93, 0.9)",
        border: `1px solid ${COLORS.spiritCyan}`,
        color: COLORS.iceWhite,
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 0 20px rgba(79, 209, 255, 0.3), 0 0 40px rgba(79, 209, 255, 0.15)",
      },
      iconTheme: {
        primary: COLORS.spiritCyan,
        secondary: COLORS.midnight,
      },
    },
  },
} as const;

/**
 * Custom toast helper functions with pre-styled toasts
 *
 * Usage:
 * import { showToast } from '@/utils/sonner-theme';
 *
 * showToast.success('Operation completed!');
 * showToast.error('Something went wrong!');
 */
export const showToast = {
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      style: sonnerToastStyles.success,
    });
  },

  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      style: sonnerToastStyles.error,
    });
  },

  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      style: sonnerToastStyles.warning,
    });
  },

  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      style: sonnerToastStyles.info,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: "rgba(27, 58, 93, 0.9)",
        border: `1px solid ${COLORS.spiritCyan}`,
        color: COLORS.iceWhite,
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 0 20px rgba(79, 209, 255, 0.3), 0 0 40px rgba(79, 209, 255, 0.15)",
      },
    });
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: sonnerToastStyles.default,
    });
  },

  custom: (message: string, options?: Record<string, unknown>) => {
    return toast(message, {
      ...options,
      style: {
        ...sonnerToastStyles.default,
        ...(options?.style as Record<string, unknown>),
      },
    });
  },
};

/**
 * Example usage in a component:
 *
 * import { showToast } from '@/utils/sonner-theme';
 *
 * // Simple success toast
 * showToast.success('Profile updated successfully!');
 *
 * // Toast with description
 * showToast.error('Failed to save', 'Please check your internet connection');
 *
 * // Loading toast
 * const loadingToast = showToast.loading('Saving changes...');
 * // Later dismiss it
 * toast.dismiss(loadingToast);
 *
 * // Promise toast
 * showToast.promise(
 *   saveData(),
 *   {
 *     loading: 'Saving...',
 *     success: 'Saved successfully!',
 *     error: 'Failed to save',
 *   }
 * );
 */

export default sonnerTheme;
