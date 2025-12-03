import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ParentalConsentStatus {
  parentalConsentStatus: 'not_required' | 'pending' | 'approved' | 'denied' | null;
  isMinor: boolean;
  needsParentalConsent: boolean;
}

export function useParentalConsentStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['parental-consent-status', user?.id],
    queryFn: async (): Promise<ParentalConsentStatus> => {
      if (!user?.id) {
        return {
          parentalConsentStatus: null,
          isMinor: false,
          needsParentalConsent: false,
        };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('parental_consent_status, is_minor')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[useParentalConsentStatus] Error fetching consent status:', error);
        return {
          parentalConsentStatus: null,
          isMinor: false,
          needsParentalConsent: false,
        };
      }

      const status = data?.parental_consent_status as ParentalConsentStatus['parentalConsentStatus'];
      const isMinor = data?.is_minor ?? false;
      
      // User needs consent if they are a minor AND status is pending
      const needsParentalConsent = isMinor && status === 'pending';

      return {
        parentalConsentStatus: status,
        isMinor,
        needsParentalConsent,
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
