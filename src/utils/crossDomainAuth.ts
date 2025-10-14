import { supabase } from '@/integrations/supabase/client';

/**
 * Clears invalid session from localStorage and Supabase
 * Used when detecting cross-domain session issues
 */
export const clearInvalidSession = async (): Promise<void> => {
  console.log('crossDomainAuth: Clearing invalid session');
  try {
    await supabase.auth.signOut({ scope: 'local' });
    localStorage.clear();
  } catch (error) {
    console.error('crossDomainAuth: Error clearing session:', error);
    // Clear localStorage anyway
    localStorage.clear();
  }
};

/**
 * Checks if the current domain is the preview domain
 */
export const isPreviewDomain = (): boolean => {
  return window.location.hostname.includes('lovableproject.com');
};

/**
 * Gets the production login URL
 */
export const getProductionLoginUrl = (): string => {
  return 'https://fpkuniversity.com/login';
};

/**
 * Validates if a session is still valid server-side
 * Returns true if valid, false if invalid
 */
export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.log('crossDomainAuth: No valid session found');
      return false;
    }
    
    // Verify session is valid by making a test API call
    const { error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (testError) {
      // Check if it's an authentication error
      if (testError.message.includes('JWT') || testError.message.includes('session')) {
        console.log('crossDomainAuth: Session JWT is invalid');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('crossDomainAuth: Session validation error:', error);
    return false;
  }
};
