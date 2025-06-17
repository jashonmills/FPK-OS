
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useEffect, useState } from 'react';

interface DualLanguageTextProps {
  translationKey: string;
  fallback?: string;
  className?: string;
  namespace?: string;
  children?: never;
}

const DualLanguageText: React.FC<DualLanguageTextProps> = ({
  translationKey,
  fallback,
  className = "",
  namespace = 'translation',
}) => {
  const { t, i18n } = useTranslation(namespace);
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

  // Listen for storage events to sync across components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fpk-dual-language') {
        const newValue = e.newValue === 'true';
        console.log('DualLanguageText: Storage changed, updating to:', newValue);
        setIsDualLanguageEnabled(newValue);
      }
    };

    // Listen for custom events as well
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'fpk-dual-language') {
        const newValue = e.detail.newValue === 'true';
        console.log('DualLanguageText: Custom storage event, updating to:', newValue);
        setIsDualLanguageEnabled(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dual-language-change', handleCustomStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dual-language-change', handleCustomStorageChange as EventListener);
    };
  }, []);
  
  const primaryText = t(translationKey, fallback);
  
  console.log('DualLanguageText render:', { 
    translationKey, 
    namespace,
    isDualLanguageEnabled, 
    isEnglish, 
    primaryText 
  });
  
  if (!isDualLanguageEnabled || isEnglish) {
    return <span className={className}>{primaryText}</span>;
  }
  
  // Get English version for dual language mode
  const englishText = i18n.getResourceBundle('en', namespace);
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
