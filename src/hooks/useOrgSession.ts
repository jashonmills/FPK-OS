import { useState, useEffect, useCallback } from 'react';

// Define the shape of the session context object
interface OrgSessionContext {
  orgId: string;
  role: string;
  userId: string;
  timestamp: number;
}

const SESSION_STORAGE_KEY = 'fpk_org_session_context';

export const useOrgSession = () => {
  const [session, setInternalSession] = useState<OrgSessionContext | null>(() => {
    try {
      const item = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  });

  const setSession = useCallback((context: OrgSessionContext) => {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(context));
      setInternalSession(context);
    } catch (error) {
      console.error('Failed to save org session to sessionStorage', error);
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      setInternalSession(null);
    } catch (error) {
      console.error('Failed to clear org session from sessionStorage', error);
    }
  }, []);

  const isValidSession = useCallback((maxAgeMinutes: number = 480): boolean => { // 8-hour default validity
    if (!session) return false;
    const sessionAgeMinutes = (Date.now() - session.timestamp) / (1000 * 60);
    return sessionAgeMinutes < maxAgeMinutes;
  }, [session]);

  // Listen for changes in other tabs (optional but good practice)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SESSION_STORAGE_KEY) {
        setInternalSession(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    session,
    setSession,
    clearSession,
    isValidSession,
  };
};
