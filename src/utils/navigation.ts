/**
 * Navigation utilities for components that can't use React Router hooks
 */

declare global {
  interface Window {
    __reactRouterNavigate?: (to: string, options?: { replace?: boolean }) => void;
  }
}

/**
 * Safe navigation function that works with or without React Router
 * Primarily for use in class components or error boundaries
 */
export const safeNavigate = (to: string, options?: { replace?: boolean }) => {
  try {
    // Try to use React Router navigate if available
    const navigate = window.__reactRouterNavigate;
    if (navigate && typeof navigate === 'function') {
      navigate(to, options);
      return;
    }
  } catch (error) {
    console.warn('React Router navigation failed, falling back to window.location', error);
  }
  
  // Fallback to window.location
  if (options?.replace) {
    window.location.replace(to);
  } else {
    window.location.href = to;
  }
};

/**
 * Initialize the global navigation function
 * Should be called from a component that has access to useNavigate
 */
export const initializeNavigation = (navigate: (to: string, options?: { replace?: boolean }) => void) => {
  window.__reactRouterNavigate = navigate;
};