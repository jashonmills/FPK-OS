
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useEffect, useState } from 'react';

export const useDualLanguage = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useUserProfile();
  const [isDualLanguageEnabled, setIsDualLanguageEnabled] = useState(false);
  
  const isEnglish = i18n.language === 'en';

  // Sync dual language state from profile or localStorage
  useEffect(() => {
    if (profile) {
      setIsDualLanguageEnabled(profile.dual_language_enabled || false);
    } else {
      // Fallback to localStorage
      const savedDualLanguage = localStorage.getItem('fpk-dual-language');
      setIsDualLanguageEnabled(savedDualLanguage === 'true');
    }
  }, [profile]);

  const getDualText = (key: string, fallback?: string) => {
    const primaryText = t(key, fallback);
    
    if (!isDualLanguageEnabled || isEnglish) {
      return primaryText;
    }
    
    // Get English version for dual language mode
    const englishText = i18n.getResourceBundle('en', 'translation');
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    };
    
    const englishTranslation = getNestedValue(englishText, key) || fallback || key;
    
    return {
      primary: primaryText,
      english: englishTranslation,
    };
  };

  return {
    t: getDualText,
    isDualLanguageEnabled,
    isEnglish,
  };
};
