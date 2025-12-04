
import React from 'react';
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

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
  namespace = 'common',
}) => {
  const { t, renderText } = useGlobalTranslation(namespace);
  
  // Extract the actual key from the full path (e.g., "nav.home" from "nav.home")
  const keyParts = translationKey.split('.');
  const actualKey = keyParts.length > 1 ? keyParts[keyParts.length - 1] : translationKey;
  
  // Try to get translation, fallback to the actual key or provided fallback
  const translatedText = t(translationKey, fallback || actualKey);
  
  return (
    <span className={className}>
      {renderText(translatedText, className)}
    </span>
  );
};

export default DualLanguageText;
