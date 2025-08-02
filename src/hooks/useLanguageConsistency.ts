/**
 * Language Consistency Hook
 * Ensures translation keys are properly handled and language switching maintains state
 */

import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

interface LanguageConsistencyOptions {
  maintainRouteOnLanguageChange?: boolean;
  fallbackToKey?: boolean;
  logMissingKeys?: boolean;
}

export const useLanguageConsistency = (options: LanguageConsistencyOptions = {}) => {
  const {
    maintainRouteOnLanguageChange = true,
    fallbackToKey = true,
    logMissingKeys = process.env.NODE_ENV === 'development'
  } = options;

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Store current route when language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (maintainRouteOnLanguageChange) {
        // Store current route parameters and search params
        const currentPath = location.pathname;
        const currentSearch = location.search;
        const currentHash = location.hash;
        
        // Store in sessionStorage to persist across language change
        sessionStorage.setItem('lastRoute', `${currentPath}${currentSearch}${currentHash}`);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, location, maintainRouteOnLanguageChange]);

  // Restore route after language change
  useEffect(() => {
    const savedRoute = sessionStorage.getItem('lastRoute');
    if (savedRoute && savedRoute !== location.pathname + location.search + location.hash) {
      // Small delay to ensure language change is complete
      setTimeout(() => {
        navigate(savedRoute, { replace: true });
        sessionStorage.removeItem('lastRoute');
      }, 100);
    }
  }, [i18n.language, navigate, location]);

  // Enhanced translation function with fallbacks and logging
  const safeT = useCallback((key: string, fallback?: string, options?: any) => {
    try {
      const translation = t(key, options);
      
      // Check if translation was found (react-i18next returns the key if not found)
      if (translation === key && fallback) {
        if (logMissingKeys) {
          console.warn(`🌍 Missing translation for key: "${key}" in language: ${i18n.language}`);
        }
        return fallbackToKey ? fallback : key;
      }
      
      return translation;
    } catch (error) {
      if (logMissingKeys) {
        console.error(`🌍 Translation error for key "${key}":`, error);
      }
      return fallback || key;
    }
  }, [t, i18n.language, fallbackToKey, logMissingKeys]);

  // Check for missing translation keys in the current namespace
  const auditTranslationKeys = useCallback((namespace?: string) => {
    if (!logMissingKeys) return;

    const commonKeys = [
      'common.loading',
      'common.error',
      'common.save',
      'common.cancel',
      'common.delete',
      'common.edit',
      'nav.dashboard',
      'nav.courses',
      'nav.library',
      'nav.profile'
    ];

    const missingKeys: string[] = [];
    
    commonKeys.forEach(key => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const translation = t(fullKey);
      
      if (translation === fullKey) {
        missingKeys.push(fullKey);
      }
    });

    if (missingKeys.length > 0) {
      console.warn(`🌍 Missing translations in ${i18n.language}:`, missingKeys);
    }
  }, [t, i18n.language, logMissingKeys]);

  // Get current language info
  const getCurrentLanguageInfo = useCallback(() => {
    const supportedLanguages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' }
    ];

    const currentLang = supportedLanguages.find(lang => lang.code === i18n.language);
    return {
      current: currentLang || { code: i18n.language, name: i18n.language },
      available: supportedLanguages,
      isRTL: ['ar', 'he', 'fa'].includes(i18n.language)
    };
  }, [i18n.language]);

  // Format text with proper text direction
  const formatText = useCallback((text: string, options: {
    preserveDirection?: boolean;
    addDirectionMarker?: boolean;
  } = {}) => {
    const { isRTL } = getCurrentLanguageInfo();
    
    if (options.addDirectionMarker && isRTL) {
      return `\u202B${text}\u202C`; // Add RTL markers
    }
    
    return text;
  }, [getCurrentLanguageInfo]);

  return {
    safeT,
    auditTranslationKeys,
    getCurrentLanguageInfo,
    formatText,
    currentLanguage: i18n.language,
    isReady: i18n.isInitialized
  };
};

export default useLanguageConsistency;