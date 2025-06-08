
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';

export const useDualLanguage = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useUserProfile();
  
  const isDualLanguageEnabled = profile?.dual_language_enabled || false;
  const isEnglish = i18n.language === 'en';

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
