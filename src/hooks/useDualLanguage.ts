
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

export const useDualLanguage = (namespace?: string) => {
  const { t, isDualLanguageEnabled, isEnglish } = useGlobalTranslation(namespace);

  const getDualText = (key: string, fallback?: string) => {
    return t(key, fallback);
  };

  return {
    t: getDualText,
    isDualLanguageEnabled,
    isEnglish,
  };
};
