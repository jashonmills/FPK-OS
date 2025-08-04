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
   * Navigate to a specific route with authentication checks
   */
  const safeNavigate = (to: string, options?: { replace?: boolean; state?: any }) => {
    // If trying to navigate to protected routes without authentication, redirect to login
    const protectedRoutes = ['/dashboard', '/profile', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => to.startsWith(route));
    
    if (isProtectedRoute && !user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    navigate(to, options);
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
    navigate, // Keep original navigate for cases where we need it
  };
};