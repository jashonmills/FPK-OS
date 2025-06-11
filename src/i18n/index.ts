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

// Keep legacy imports for other languages (to be refactored separately)
import zh from '@/locales/zh.json';
import de from '@/locales/de.json';

const resources = {
  en: {
    translation: {
      common: enCommon,
      dashboard: enDashboard,
      courses: enCourses,
      auth: enAuth,
      settings: enSettings,
      goals: enGoals,
      nav: enNavigation,
      liveHub: enLiveHub,
      preview: enPreview
    }
  },
  zh: {
    translation: zh
  },
  de: {
    translation: de
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
