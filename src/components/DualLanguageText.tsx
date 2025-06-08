
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useEffect, useState } from 'react';

interface DualLanguageTextProps {
  translationKey: string;
  fallback?: string;
  className?: string;
  children?: never;
}

const DualLanguageText: React.FC<DualLanguageTextProps> = ({
  translationKey,
  fallback,
  className = "",
}) => {
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
  
  const primaryText = t(translationKey, fallback);
  
  if (!isDualLanguageEnabled || isEnglish) {
    return <span className={className}>{primaryText}</span>;
  }
  
  // Get English version for dual language mode
  const englishText = i18n.getResourceBundle('en', 'translation');
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };
  
  const englishTranslation = getNestedValue(englishText, translationKey) || fallback || translationKey;
  
  return (
    <span className={className}>
      <span className="block font-medium">{primaryText}</span>
      <span className="block text-sm text-gray-500 italic">{englishTranslation}</span>
    </span>
  );
};

export default DualLanguageText;
