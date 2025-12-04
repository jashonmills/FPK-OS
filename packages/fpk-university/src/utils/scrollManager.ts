/**
 * Global scroll management utilities for consistent scroll behavior
 */

/**
 * Smooth scroll to top of page
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({ top: 0, left: 0, behavior });
};

/**
 * Scroll to a specific element by ID
 */
export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth') => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' });
  }
};

/**
 * Setup global scroll restoration for navigation
 * Call this in your main app component
 */
export const setupScrollRestoration = () => {
  // Enable manual scroll restoration to control when it happens
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Listen for navigation events and scroll to top
  const handleNavigation = () => {
    setTimeout(() => scrollToTop(), 50);
  };
  
  // Listen for popstate events (back/forward navigation)
  window.addEventListener('popstate', handleNavigation);
  
  return () => {
    window.removeEventListener('popstate', handleNavigation);
  };
};

/**
 * Hook for components that need scroll management
 */
export const useScrollManager = () => {
  return {
    scrollToTop,
    scrollToElement,
  };
};