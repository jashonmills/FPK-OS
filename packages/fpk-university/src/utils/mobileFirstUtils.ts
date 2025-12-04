/**
 * Mobile-First Design Utilities for FPK University
 * Core utilities for implementing mobile-first responsive design system-wide
 */

export const MOBILE_BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Touch-friendly interaction constants
 */
export const TOUCH_TARGETS = {
  minimum: 44,     // iOS/Android minimum touch target
  comfortable: 48, // Comfortable touch target
  large: 56,       // Large touch target for primary actions
} as const;

/**
 * Mobile-first typography scales
 */
export const MOBILE_TYPOGRAPHY = {
  fontSize: {
    xs: 'text-xs leading-normal',
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg md:text-xl leading-tight',
    xl: 'text-lg sm:text-xl md:text-2xl leading-tight',
    '2xl': 'text-xl sm:text-2xl md:text-3xl leading-tight',
  },
  headings: {
    h1: 'mobile-heading-xl',
    h2: 'mobile-heading-lg', 
    h3: 'mobile-heading-md',
  }
} as const;

/**
 * Mobile-first spacing system
 */
export const MOBILE_SPACING = {
  section: 'mobile-section-spacing',
  stack: 'mobile-stack',
  container: 'mobile-container',
  page: 'mobile-page-container',
  card: 'mobile-card-padding',
  cardCompact: 'mobile-card-compact',
} as const;

/**
 * Mobile-optimized grid patterns
 */
export const MOBILE_GRIDS = {
  // Responsive grids for different content types
  analytics: 'mobile-analytics-grid',
  courses: 'mobile-grid',
  navigation: 'mobile-nav-grid',
  twoColumn: 'mobile-grid-2',
} as const;

/**
 * Custom grid builder function (separate from MOBILE_GRIDS)
 */
export const buildAdaptiveGrid = (cols: { mobile?: number; tablet?: number; desktop?: number }) => {
  const mobile = cols.mobile || 1;
  const tablet = cols.tablet || 2; 
  const desktop = cols.desktop || 3;
  return `grid grid-cols-${mobile} gap-3 sm:grid-cols-${tablet} sm:gap-4 lg:grid-cols-${desktop} lg:gap-6`;
};

/**
 * Mobile-first button configurations
 */
export const MOBILE_BUTTONS = {
  // Touch-friendly button classes
  primary: 'mobile-button bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'mobile-button bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'mobile-button border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'mobile-button hover:bg-accent hover:text-accent-foreground',
  // Size variants with proper touch targets
  sizes: {
    xs: 'min-h-[36px] px-2 py-1 text-xs',
    sm: 'min-h-[40px] px-3 py-1.5 text-sm',
    default: 'min-h-[44px] px-4 py-2 text-base sm:text-sm',
    lg: 'min-h-[48px] px-6 py-3 text-base',
  }
} as const;

/**
 * Mobile-optimized form elements
 */
export const MOBILE_FORMS = {
  input: 'mobile-input',
  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  fieldset: 'mobile-stack',
  buttonGroup: 'flex flex-col gap-2 sm:flex-row sm:gap-3',
} as const;

/**
 * Mobile navigation patterns
 */
export const MOBILE_NAVIGATION = {
  tabList: 'mobile-tab-list',
  tabTrigger: 'mobile-tab-trigger',
  tabScrollable: 'flex overflow-x-auto scrollbar-hide gap-1 p-1 bg-muted rounded-lg',
} as const;

/**
 * Mobile-safe content utilities
 */
export const MOBILE_CONTENT = {
  safeText: 'mobile-safe-text',
  scrollContainer: 'mobile-scroll-container',
  fullWidth: 'w-full max-w-full',
  viewportConstrain: 'max-w-full overflow-x-hidden',
} as const;

/**
 * Responsive utility functions
 */
export const mobileUtils = {
  /**
   * Check if current viewport is mobile
   */
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINTS.sm;
  },

  /**
   * Get responsive classes for button groups
   */
  getButtonGroupClasses: (stacked: boolean = false): string => {
    return stacked 
      ? 'flex flex-col gap-2 w-full' 
      : 'flex flex-col gap-2 sm:flex-row sm:gap-3';
  },

  /**
   * Get responsive grid classes
   */
  getGridClasses: (type: keyof typeof MOBILE_GRIDS): string => {
    return MOBILE_GRIDS[type];
  },

  /**
   * Get touch-friendly size classes
   */
  getTouchSize: (size: keyof typeof TOUCH_TARGETS): string => {
    return `min-h-[${TOUCH_TARGETS[size]}px] min-w-[${TOUCH_TARGETS[size]}px]`;
  }
} as const;

/**
 * Mobile-first component class builders
 */
export const buildMobileClasses = {
  /**
   * Build container classes with responsive padding
   */
  container: (variant: 'page' | 'section' | 'card' = 'page'): string => {
    const variants = {
      page: 'mobile-page-container',
      section: 'mobile-container py-4 sm:py-6',
      card: 'mobile-card-padding'
    };
    return variants[variant];
  },

  /**
   * Build responsive text classes
   */
  text: (size: keyof typeof MOBILE_TYPOGRAPHY.fontSize): string => {
    return MOBILE_TYPOGRAPHY.fontSize[size];
  },

  /**
   * Build mobile-optimized card classes
   */
  card: (interactive: boolean = false): string => {
    const base = 'mobile-card mobile-card-padding';
    return interactive ? `${base} mobile-card-interactive` : base;
  }
} as const;