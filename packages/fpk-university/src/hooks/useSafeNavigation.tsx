import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook that provides safe navigation methods that respect authentication state
 * and prevent bypassing login requirements through browser history manipulation
 */
export const useSafeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  /**
   * Scroll to top of page - used for smart redirects
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  /**
   * Safe back navigation that checks authentication before navigating
   * If the user is not authenticated, redirects to login instead of following browser history
   */
  const navigateBack = () => {
    // If user is not authenticated, always go to login
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if we came from a login/auth page based on referrer or state
    const state = location.state as { from?: string } | null;
    const referrer = state?.from;

    // If we came from login or registration, go to dashboard instead of back
    if (referrer === '/login' || referrer === '/' || !referrer) {
      navigate('/dashboard');
      return;
    }

    // For authenticated users with safe referrer, use normal back navigation
    navigate(-1);
  };

  /**
   * Navigate to a specific route with authentication checks and auto scroll-to-top
   */
  const safeNavigate = (to: string, options?: { replace?: boolean; state?: any; scrollToTop?: boolean }) => {
    // If trying to navigate to protected routes without authentication, redirect to login
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => to.startsWith(route));
    
    if (isProtectedRoute && !user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    navigate(to, options);
    
    // Auto scroll to top unless explicitly disabled
    if (options?.scrollToTop !== false) {
      setTimeout(scrollToTop, 50); // Small delay to ensure page has rendered
    }
  };

  /**
   * Navigate to legal pages with proper state tracking
   */
  const navigateToLegal = (page: 'privacy' | 'terms') => {
    const targetPath = page === 'privacy' ? '/privacy' : '/terms';
    navigate(targetPath, { 
      state: { from: location.pathname },
      replace: false 
    });
  };

  return {
    navigateBack,
    safeNavigate,
    navigateToLegal,
    scrollToTop,
    navigate, // Keep original navigate for cases where we need it
  };
};