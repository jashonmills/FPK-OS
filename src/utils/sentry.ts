// Lazy import Sentry to avoid bundle size impact
let sentryInitialized = false;

export const initSentry = async () => {
  if (sentryInitialized || !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  try {
    const Sentry = await import('@sentry/react');
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'local',
      beforeSend(event) {
        // Don't send events in development unless explicitly enabled
        if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SENTRY_DEBUG) {
          return null;
        }
        return event;
      },
    });

    sentryInitialized = true;
    console.debug('🔍 Sentry initialized for error monitoring');
  } catch (error) {
    console.warn('Failed to initialize Sentry:', error);
  }
};

export const captureError = async (error: Error, extra?: Record<string, any>) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  try {
    await initSentry();
    const Sentry = await import('@sentry/react');
    Sentry.captureException(error, { extra });
  } catch (sentryError) {
    console.warn('Failed to capture error with Sentry:', sentryError);
  }
};