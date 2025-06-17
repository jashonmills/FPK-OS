
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
  
  const translatedText = t(translationKey, fallback);
  
  return (
    <span className={className}>
      {renderText(translatedText, className)}
    </span>
  );
};

export default DualLanguageText;
