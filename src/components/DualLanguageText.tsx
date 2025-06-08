
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';

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
  
  const isDualLanguageEnabled = profile?.dual_language_enabled || false;
  const isEnglish = i18n.language === 'en';
  
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
