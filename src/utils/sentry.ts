// Lazy import Sentry to avoid bundle size impact
import { logger } from '@/utils/logger';

let sentryInitialized = false;

export const initSentry = async () => {
  if (sentryInitialized || typeof window === 'undefined' || !import.meta.env?.VITE_SENTRY_DSN) {
    return;
  }

  try {
    const Sentry = await import('@sentry/react');
    
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      environment: import.meta.env.VITE_VERCEL_ENV || 'local',
      beforeSend(event) {
        // Don't send events in development unless explicitly enabled
        if (import.meta.env.DEV && !import.meta.env.VITE_SENTRY_DEBUG) {
          return null;
        }
        return event;
      },
    });

    sentryInitialized = true;
    logger.debug('Sentry initialized for error monitoring', 'SENTRY');
  } catch (error) {
    logger.warn('Failed to initialize Sentry', 'SENTRY', error);
  }
};

export const captureError = async (error: Error, extra?: Record<string, any>) => {
  // Check if running in browser environment
  if (typeof window === 'undefined' || !import.meta.env?.VITE_SENTRY_DSN) {
    logger.error('Error captured (Sentry not available)', 'SENTRY', { error, extra });
    return;
  }

  try {
    await initSentry();
    const Sentry = await import('@sentry/react');
    Sentry.captureException(error, { extra });
  } catch (sentryError) {
    logger.warn('Failed to capture error with Sentry', 'SENTRY', sentryError);
    logger.error('Original error', 'SENTRY', { error, extra });
  }
};