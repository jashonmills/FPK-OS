
import { useGlobalTranslation } from '@/hooks/useGlobalTranslation';

export const useDualLanguage = (namespace: string = 'common') => {
  const { t, tString, isDualLanguageEnabled, isEnglish } = useGlobalTranslation(namespace);

  return {
    t,
    tString,
    isDualLanguageEnabled,
    isEnglish,
  };
};
