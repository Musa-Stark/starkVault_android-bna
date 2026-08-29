const lightColors = {
  // Base colors
  background: '#F7FBF8',
  foreground: '#173124',

  // Card colors
  card: '#FFFFFF',
  cardForeground: '#173124',

  // Popover colors
  popover: '#FFFFFF',
  popoverForeground: '#173124',

  // Primary colors
  primary: '#166534',
  primaryForeground: '#FFFFFF',

  // Secondary colors
  secondary: '#EAF8EF',
  secondaryForeground: '#14532D',

  // Muted colors
  muted: '#E8EDF5',
  mutedForeground: '#667085',

  // Accent colors
  accent: '#EAF8EF',
  accentForeground: '#14532D',

  // Destructive colors
  destructive: '#ef4444',
  destructiveForeground: '#FFFFFF',

  // Border and input
  border: '#DCEDE1',
  input: '#F0F8F2',
  ring: '#86EFAC',

  // Text colors
  text: '#173124',
  textMuted: '#668073',

  // Legacy support for existing components
  tint: '#166534',
  icon: '#668073',
  tabIconDefault: '#668073',
  tabIconSelected: '#166534',

  // Default buttons, links, Send button, selected tabs
  blue: '#15803D',

  // Success states, FaceTime buttons, completed tasks
  green: '#15803D',

  // Delete buttons, error states, critical alerts
  red: '#FF3B30',

  // VoiceOver highlights, warning states
  orange: '#FF9500',

  // Notes app accent, Reminders highlights
  yellow: '#FFCC00',

  // Pink accent color for various UI elements
  pink: '#FF2D92',

  // Purple accent for creative apps and features
  purple: '#AF52DE',

  // Teal accent for communication features
  teal: '#5AC8FA',

  // Indigo accent for system features
  indigo: '#5856D6',
};

const darkColors = {
  // Base colors
  background: '#000000',
  foreground: '#F8FAFC',

  // Card colors
  card: '#1C1C1E',
  cardForeground: '#F8FAFC',

  // Popover colors
  popover: '#18181b',
  popoverForeground: '#F8FAFC',

  // Primary colors
  primary: '#22C55E',
  primaryForeground: '#18181b',

  // Secondary colors
  secondary: '#1C1C1E',
  secondaryForeground: '#FFFFFF',

  // Muted colors
  muted: '#78788033',
  mutedForeground: '#a1a1aa',

  // Accent colors
  accent: '#1C1C1E',
  accentForeground: '#FFFFFF',

  // Destructive colors
  destructive: '#dc2626',
  destructiveForeground: '#FFFFFF',

  // Border and input - using alpha values for better blending
  border: '#38383A',
  input: 'rgba(255, 255, 255, 0.15)',
  ring: '#22C55E',

  // Text colors
  text: '#F8FAFC',
  textMuted: '#a1a1aa',

  // Legacy support for existing components
  tint: '#22C55E',
  icon: '#a1a1aa',
  tabIconDefault: '#a1a1aa',
  tabIconSelected: '#22C55E',

  // Default buttons, links, Send button, selected tabs
  blue: '#22C55E',

  // Success states, FaceTime buttons, completed tasks
  green: '#22C55E',

  // Delete buttons, error states, critical alerts
  red: '#FF453A',

  // VoiceOver highlights, warning states
  orange: '#FF9F0A',

  // Notes app accent, Reminders highlights
  yellow: '#FFD60A',

  // Pink accent color for various UI elements
  pink: '#FF375F',

  // Purple accent for creative apps and features
  purple: '#BF5AF2',

  // Teal accent for communication features
  teal: '#64D2FF',

  // Indigo accent for system features
  indigo: '#5E5CE6',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Export individual color schemes for easier access
export { darkColors, lightColors };

// Utility type for color keys
export type ColorKeys = keyof typeof lightColors;

// Helper function to get color with opacity (useful for React Native)
export const withOpacity = (color: string, opacity: number) => {
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color;
  }

  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};

// Semantic color mappings for common UI patterns
export const semanticColors = {
  light: {
    success: '#22c55e',
    successForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
    info: '#3b82f6',
    infoForeground: '#ffffff',
    error: '#ef4444',
    errorForeground: '#ffffff',
  },
  dark: {
    success: '#16a34a',
    successForeground: '#ffffff',
    warning: '#d97706',
    warningForeground: '#ffffff',
    info: '#2563eb',
    infoForeground: '#ffffff',
    error: '#dc2626',
    errorForeground: '#ffffff',
  },
};
