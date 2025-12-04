
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from '@/locales/en/common.json';
import enDashboard from '@/locales/en/dashboard.json';
import enCourses from '@/locales/en/courses.json';
import enAuth from '@/locales/en/auth.json';
import enSettings from '@/locales/en/settings.json';
import enGoals from '@/locales/en/goals.json';
import enNavigation from '@/locales/en/navigation.json';
import enLiveHub from '@/locales/en/liveHub.json';
import enPreview from '@/locales/en/preview.json';

// Import other language files
import zh from '@/locales/zh.json';
import de from '@/locales/de.json';

// Export supported languages for LanguageSwitcher
export const supportedLanguages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'de', name: 'German', native: 'Deutsch' },
];

const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    courses: enCourses,
    auth: enAuth,
    settings: enSettings,
    goals: enGoals,
    navigation: enNavigation,
    liveHub: enLiveHub,
    preview: enPreview
  },
  zh: {
    common: zh,
    dashboard: zh,
    courses: zh,
    auth: zh,
    settings: zh,
    goals: zh,
    navigation: zh,
    liveHub: zh,
    preview: zh
  },
  de: {
    common: de,
    dashboard: de,
    courses: de,
    auth: de,
    settings: de,
    goals: de,
    navigation: de,
    liveHub: de,
    preview: de
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'fpk-language'
    },
  });

export default i18n;
