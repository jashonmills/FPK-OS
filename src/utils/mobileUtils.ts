/**
 * Mobile utility functions and constants
 */

export const MOBILE_BREAKPOINT = 768;

/**
 * Check if current viewport is mobile
 */
export const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
};

/**
 * Mobile-optimized class names for common responsive patterns
 */
export const mobileClasses = {
  container: 'px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6',
  text: {
    title: 'text-lg sm:text-xl md:text-2xl font-bold',
    subtitle: 'text-sm sm:text-base text-muted-foreground',
    body: 'text-sm leading-relaxed'
  },
  spacing: {
    section: 'space-y-3 sm:space-y-4 md:space-y-6',
    element: 'gap-2 sm:gap-3 md:gap-4'
  },
  button: {
    touch: 'h-10 px-4 text-sm min-w-[44px]', // Minimum touch target size
    compact: 'h-8 px-3 text-xs'
  }
};

/**
 * Get responsive grid classes based on content type
 */
export const getResponsiveGrid = (type: 'cards' | 'list' | 'compact'): string => {
  switch (type) {
    case 'cards':
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
    case 'list':
      return 'grid grid-cols-1 gap-3';
    case 'compact':
      return 'grid grid-cols-1 gap-1';
    default:
      return 'grid grid-cols-1 gap-4';
  }
};

/**
 * Mobile-optimized container constraints
 */
export const mobileContainerConstraints = {
  maxWidth: 'max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl',
  padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
  margin: 'mx-auto'
};