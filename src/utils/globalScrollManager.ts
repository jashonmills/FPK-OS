/**
 * Global scroll management system for React Router navigation
 * Ensures all navigation automatically scrolls to top
 */

let scrollToTopOnNavigation = true;

/**
 * Smooth scroll to top of page
 */
export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({ top: 0, left: 0, behavior });
};

/**
 * Instant scroll to top (for navigation)
 */
export const scrollToTopInstant = () => {
  window.scrollTo(0, 0);
};

/**
 * Setup automatic scroll-to-top on all navigation events
 * This should be called in your main App component
 */
export const setupGlobalScrollRestoration = () => {
  // Disable browser's automatic scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Track previous pathname to detect navigation
  let previousPathname = window.location.pathname;
  
  const handleNavigation = () => {
    const currentPathname = window.location.pathname;
    
    // Only scroll if pathname actually changed and we're enabling scroll on nav
    if (currentPathname !== previousPathname && scrollToTopOnNavigation) {
      // Use RAF to ensure DOM has updated
      requestAnimationFrame(() => {
        scrollToTopInstant();
      });
    }
    
    previousPathname = currentPathname;
  };
  
  // Listen for all types of navigation
  window.addEventListener('popstate', handleNavigation);
  
  // Listen for programmatic navigation (React Router)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    handleNavigation();
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    handleNavigation();
  };
  
  return () => {
    window.removeEventListener('popstate', handleNavigation);
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  };
};

/**
 * Temporarily disable scroll-to-top for specific navigation
 */
export const withoutScrollToTop = (callback: () => void) => {
  scrollToTopOnNavigation = false;
  callback();
  // Re-enable after a short delay
  setTimeout(() => {
    scrollToTopOnNavigation = true;
  }, 100);
};

/**
 * Hook for components that need scroll management
 */
export const useScrollManager = () => {
  return {
    scrollToTop,
    scrollToTopInstant,
    withoutScrollToTop,
  };
};