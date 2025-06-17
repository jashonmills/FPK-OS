
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useEffect, useState } from 'react';

export const useGlobalTranslation = (namespace: string = 'common') => {
  const { t: originalT, i18n } = useTranslation(namespace);
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
        setIsDualLanguageEnabled(newValue);
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'fpk-dual-language') {
        const newValue = e.detail.newValue === 'true';
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

  // Simple translation function with fallbacks
  const getTranslation = (key: string, fallback?: string) => {
    // Try to get translation from current namespace
    const translation = originalT(key);
    
    // If translation equals the key (meaning no translation found), use fallback
    if (translation === key) {
      if (fallback) return fallback;
      
      // Extract readable text from key (e.g., "nav.home" -> "Home")
      const keyParts = key.split('.');
      const lastPart = keyParts[keyParts.length - 1];
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }
    
    return translation;
  };

  const t = (key: string, fallback?: string): string | { primary: string; english: string } => {
    const primaryText = getTranslation(key, fallback);
    
    if (!isDualLanguageEnabled || isEnglish) {
      return primaryText;
    }
    
    // For dual language mode, try to get English version
    const englishTranslation = i18n.getResourceBundle('en', namespace)?.[key];
    const englishText = englishTranslation || fallback || primaryText;
    
    return {
      primary: primaryText,
      english: englishText,
    };
  };

  const tString = (key: string, fallback?: string): string => {
    const result = t(key, fallback);
    return typeof result === 'string' ? result : result.primary;
  };

  const renderText = (text: string | { primary: string; english: string }, className?: string): React.ReactNode => {
    if (typeof text === 'string') {
      return text;
    }
    
    return React.createElement(
      'span',
      { className },
      React.createElement('span', { className: 'block font-medium' }, text.primary),
      React.createElement('span', { className: 'block text-sm text-gray-500 italic' }, text.english)
    );
  };

  return {
    t,
    tString,
    renderText,
    isDualLanguageEnabled,
    isEnglish,
    i18n
  };
};
