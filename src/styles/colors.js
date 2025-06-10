// Centralized color palette for the Lapor Parkir app
// This file contains all colors used throughout the application
// Modify these values to change the entire app's color scheme

const colors = {
  // Primary Colors
  primary: "#e74c3c", // Main red color for primary actions/branding
  primaryDark: "#c0392b", // Darker variant for pressed states

  // Secondary Colors
  success: "#27ae60", // Green for success states
  warning: "#f39c12", // Orange for warning states
  info: "#3498db", // Blue for info states

  // Neutral Colors
  white: "#fff",
  black: "#000",

  // Text Colors
  textPrimary: "#333", // Primary text color
  textSecondary: "#666", // Secondary text color
  textMuted: "#999", // Muted/placeholder text

  // Background Colors
  background: "#f5f5f5", // Main background color
  surface: "#fff", // Card/surface background
  surfaceSecondary: "#f8f9fa", // Secondary surface (notes containers, etc.)

  // Border Colors
  border: "#ddd", // Default border color
  borderLight: "#e0e0e0", // Light border variant
  borderMuted: "#f0f0f0", // Very light border for separators

  // Status Colors
  disabled: "#bdc3c7", // Disabled state color
  error: "#e74c3c", // Error state (same as primary for this app)
  errorLight: "#ffeaea", // Light error background

  // Shadow Colors
  shadow: "#000", // Shadow color (always black with opacity)

  // Overlay Colors
  overlay: "rgba(0, 0, 0, 0.5)", // Modal overlay background
};

// Color variants with opacity for common use cases
export const colorVariants = {
  // Primary variants
  primaryWithOpacity: (opacity) => `rgba(231, 76, 60, ${opacity})`,

  // Shadow variants
  shadowLight: "rgba(0, 0, 0, 0.1)",
  shadowMedium: "rgba(0, 0, 0, 0.25)",

  // Text variants
  textWithOpacity: (opacity) => `rgba(51, 51, 51, ${opacity})`,
};

// Semantic color mapping for specific UI elements
export const semanticColors = {
  // Navigation
  tabBarActive: colors.primary,
  tabBarBackground: colors.surface,
  tabBarBorder: colors.borderLight,
  headerBackground: colors.primary,
  headerText: colors.white,

  // Drawer Navigation
  drawerBackground: colors.surfaceSecondary,
  drawerText: colors.textPrimary,
  drawerTextInactive: colors.textSecondary,
  drawerActiveBackground: `${colors.primary}15`,
  drawerItemHover: `${colors.primary}10`,
  drawerSeparator: colors.borderLight,

  // Language Switcher
  languageSwitcherButton: "rgba(255, 255, 255, 0.1)",
  languageSwitcherText: colors.white,
  languageSwitcherDropdownBackground: colors.surface,
  languageSwitcherDropdownText: colors.textPrimary,
  languageSwitcherDropdownTextSecondary: colors.textSecondary,
  languageSwitcherActiveItem: `${colors.primary}10`,
  languageSwitcherActiveText: colors.primary,
  languageSwitcherOverlay: "rgba(0, 0, 0, 0.3)",
  languageSwitcherShadow: colors.shadow,

  // Buttons
  buttonPrimary: colors.primary,
  buttonPrimaryText: colors.white,
  buttonSecondary: colors.surface,
  buttonSecondaryText: colors.textPrimary,
  buttonDisabled: colors.disabled,
  buttonDisabledText: colors.white,

  // Forms
  inputBackground: colors.surface,
  inputBorder: colors.border,
  inputBorderError: colors.error,
  inputText: colors.textPrimary,
  inputPlaceholder: colors.textMuted,

  // Cards
  cardBackground: colors.surface,
  cardBorder: colors.borderLight,
  cardShadow: colors.shadow,

  // Status indicators
  plateNumberBackground: colors.primary,
  plateNumberText: colors.white,
  violationText: colors.primary,
  successText: colors.success,

  // Icons and decorative elements
  iconBackground: colors.background,

  // Filter chips
  chipBackground: colors.surface,
  chipBorder: colors.border,
  chipActiveBackground: colors.primary,
  chipActiveText: colors.white,
  chipText: colors.textSecondary,

  // Modal/Dialog
  modalOverlay: colors.overlay,
  modalBackground: colors.surface,
  modalBorder: colors.borderMuted,

  // Notifications
  notificationSuccess: colors.success,
  notificationError: colors.error,
  notificationText: colors.white,
};

export default colors;
