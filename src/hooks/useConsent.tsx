import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { safeLocalStorage } from '@/utils/safeStorage';

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface ConsentContextType {
  preferences: ConsentPreferences;
  hasConsent: (type: keyof ConsentPreferences) => boolean;
  updateConsent: (preferences: ConsentPreferences) => Promise<void>;
  withdrawConsent: (type: keyof ConsentPreferences) => Promise<void>;
  isLoading: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConsent();
  }, [user]);

  const loadConsent = async () => {
    setIsLoading(true);
    try {
      // First check localStorage for immediate access
      const localConsent = safeLocalStorage.getItem<string>('cookie-consent', {
        fallbackValue: null,
        logErrors: false
      });
      if (localConsent) {
        const parsed = JSON.parse(localConsent);
        setPreferences(parsed);
      }

      // If user is authenticated, load from database
      if (user) {
        const { data, error } = await supabase
          .from('user_consent')
          .select('consent_type, is_granted, withdrawn_at')
          .eq('user_id', user.id)
          .is('withdrawn_at', null);

        if (error) {
          console.error('Error loading consent:', error);
          return;
        }

        // Convert database records to preferences object
        const dbPreferences: ConsentPreferences = {
          essential: true, // Always true
          analytics: false,
          marketing: false,
          functional: false,
        };

        data?.forEach((record) => {
          if (record.consent_type in dbPreferences) {
            dbPreferences[record.consent_type as keyof ConsentPreferences] = record.is_granted;
          }
        });

        setPreferences(dbPreferences);
        // Sync with localStorage
        safeLocalStorage.setItem('cookie-consent', JSON.stringify(dbPreferences));
      }
    } catch (error) {
      console.error('Error loading consent preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsent = async (newPreferences: ConsentPreferences) => {
    setPreferences(newPreferences);
    safeLocalStorage.setItem('cookie-consent', JSON.stringify(newPreferences));

    // If user is authenticated, save to database
    if (user) {
      try {
        const clientIP = await getClientIP();
        const consentRecords = Object.entries(newPreferences).map(([type, granted]) => ({
          user_id: user.id,
          consent_type: type,
          is_granted: granted,
          granted_at: granted ? new Date().toISOString() : null,
          legal_basis: 'consent',
          purpose: getConsentPurpose(type),
          ip_address: clientIP,
          user_agent: navigator.userAgent,
        }));

        // Insert new consent records
        const { error } = await supabase
          .from('user_consent')
          .insert(consentRecords);

        if (error) {
          console.error('Error saving consent:', error);
        }

        // Record audit event
        await recordAuditEvent('update', 'user_consent', null, null, {
          consent_preferences: newPreferences
        }, 'consent', 'User updated cookie consent preferences');

      } catch (error) {
        console.error('Error updating consent in database:', error);
      }
    }

    // Apply consent preferences immediately
    applyConsentPreferences(newPreferences);
  };

  const withdrawConsent = async (type: keyof ConsentPreferences) => {
    const updatedPreferences = { ...preferences, [type]: false };
    await updateConsent(updatedPreferences);

    // Mark specific consent as withdrawn in database
    if (user) {
      try {
        await supabase
          .from('user_consent')
          .update({ 
            withdrawn_at: new Date().toISOString(),
            is_granted: false 
          })
          .eq('user_id', user.id)
          .eq('consent_type', type)
          .is('withdrawn_at', null);

        await recordAuditEvent('withdraw', 'user_consent', null, null, {
          consent_type: type
        }, 'consent', `User withdrew ${type} consent`);

      } catch (error) {
        console.error('Error withdrawing consent:', error);
      }
    }
  };

  const hasConsent = (type: keyof ConsentPreferences): boolean => {
    return preferences[type];
  };

  const applyConsentPreferences = (prefs: ConsentPreferences) => {
    // Analytics consent
    if (!prefs.analytics) {
      // Disable analytics tracking
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied'
      });
      // Clear analytics cookies
      clearAnalyticsCookies();
    } else {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted'
      });
    }

    // Marketing consent
    if (!prefs.marketing) {
      window.gtag?.('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      clearMarketingCookies();
    } else {
      window.gtag?.('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }

    // Functional consent
    if (!prefs.functional) {
      // Clear functional cookies except essential ones
      clearFunctionalCookies();
    }
  };

  const value: ConsentContextType = {
    preferences,
    hasConsent,
    updateConsent,
    withdrawConsent,
    isLoading,
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}

// Helper functions
function getConsentPurpose(type: string): string {
  const purposes = {
    essential: 'Required for platform functionality and security',
    analytics: 'Analyzing user behavior to improve platform performance',
    marketing: 'Personalizing content and delivering relevant advertisements',
    functional: 'Remembering user preferences and settings',
  };
  return purposes[type as keyof typeof purposes] || 'Unknown purpose';
}

async function getClientIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}

async function recordAuditEvent(
  action: string,
  tableName: string,
  recordId: string | null,
  oldValues: Record<string, unknown> | null,
  newValues: Record<string, unknown> | null,
  legalBasis: string,
  purpose: string
) {
  try {
    await supabase.rpc('record_audit_event', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
      p_action: action,
      p_table_name: tableName,
      p_record_id: recordId,
        p_old_values: oldValues as any,
        p_new_values: newValues as any,
      p_legal_basis: legalBasis,
      p_purpose: purpose,
    });
  } catch (error) {
    console.error('Error recording audit event:', error);
  }
}

function clearAnalyticsCookies() {
  const analyticsCookies = ['_ga', '_ga_', '_gid', '_gat', '_gtag'];
  analyticsCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });
}

function clearMarketingCookies() {
  const marketingCookies = ['_fbp', '_fbc', '__Secure-3PAPISID', '__Secure-3PSID'];
  marketingCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  });
}

function clearFunctionalCookies() {
  // Clear non-essential functional cookies
  const functionalCookies = ['theme', 'language', 'sidebar-state'];
  functionalCookies.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}