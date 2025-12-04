import { supabase } from '@/integrations/supabase/client';

/**
 * Clears session from localStorage and Supabase
 */
export const clearInvalidSession = async (): Promise<void> => {
  console.log('crossDomainAuth: Clearing session');
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch (error) {
    console.error('crossDomainAuth: Error clearing session:', error);
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
