// src/utils/logger.ts

type Json = Record<string, unknown>;
export type Level = 'debug' | 'info' | 'warn' | 'error';

// Environment-aware configuration
const isProduction = import.meta.env.PROD;
const LOG_LEVEL: Level = (import.meta.env.VITE_LOG_LEVEL as Level) || (isProduction ? 'error' : 'debug');

// Log level hierarchy for filtering
const LOG_LEVELS: Record<Level, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Check if a log level should be output based on current configuration
 */
const shouldLog = (level: Level): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL];
};

/**
 * Sanitize payload to remove potential PII in production
 */
const sanitizePayload = (payload: any): any => {
  if (!isProduction || !payload) return payload;
  
  // In production, sanitize common PII fields
  if (typeof payload === 'object') {
    const sanitized = { ...payload };
    const piiFields = ['email', 'password', 'ssn', 'phone', 'address', 'dob', 'dateOfBirth'];
    piiFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });
    return sanitized;
  }
  return payload;
};

/**
 * Create a log method with level and optional category support
 * Supports both 2-argument (message, payload) and 3-argument (message, category, payload) patterns
 */
const createLogMethod = (level: Level) => 
  (message: string, categoryOrPayload?: string | Json | any, payload?: Json | any) => {
    if (!shouldLog(level)) return;
    
    const timestamp = isProduction ? '' : `[${new Date().toISOString().split('T')[1].slice(0, 12)}]`;
    
    if (typeof categoryOrPayload === 'string') {
      // 3-argument pattern: message, category, payload
      const sanitizedPayload = sanitizePayload(payload);
      console[level](`${timestamp}[${level.toUpperCase()}][${categoryOrPayload}]`, message, sanitizedPayload ?? '');
    } else {
      // 2-argument pattern: message, payload
      const sanitizedPayload = sanitizePayload(categoryOrPayload);
      console[level](`${timestamp}[${level.toUpperCase()}]`, message, sanitizedPayload ?? '');
    }
  };

/**
 * Create a domain-specific logger that auto-tags with category
 */
const createDomainLogger = (domain: string) => ({
  debug: (message: string, payload?: Json | any) => createLogMethod('debug')(message, domain, payload),
  info: (message: string, payload?: Json | any) => createLogMethod('info')(message, domain, payload),
  warn: (message: string, payload?: Json | any) => createLogMethod('warn')(message, domain, payload),
  error: (message: string, payload?: Json | any) => createLogMethod('error')(message, domain, payload),
});

/**
 * Comprehensive logger used across the app.
 * 
 * Features:
 * - Environment-aware filtering (production only shows errors by default)
 * - PII sanitization in production
 * - Domain-specific loggers for cleaner categorization
 * - Supports both 2-argument and 3-argument patterns
 * 
 * Usage:
 * - logger.info('message', { data })           // General log
 * - logger.info('message', 'category', { data }) // Categorized log
 * - logger.ai.info('message', { data })        // Domain-specific log
 * 
 * Configure via VITE_LOG_LEVEL environment variable:
 * - 'error' (production default) - Only errors
 * - 'warn' - Errors and warnings
 * - 'info' - Errors, warnings, and info
 * - 'debug' (development default) - Everything
 */
export const logger = {
  // Core log methods
  debug: createLogMethod('debug'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'), 
  error: createLogMethod('error'),
  
  // Domain-specific loggers (auto-categorized)
  ai: createDomainLogger('AI'),
  courses: createDomainLogger('COURSES'),
  auth: createDomainLogger('AUTH'),
  analytics: createDomainLogger('ANALYTICS'),
  navigation: createDomainLogger('NAV'),
  storage: createDomainLogger('STORAGE'),
  realtime: createDomainLogger('REALTIME'),
  messaging: createDomainLogger('MSG'),
  governance: createDomainLogger('GOV'),
  
  // Legacy domain loggers (kept for backward compatibility)
  performance: createLogMethod('info'),
  accessibility: createLogMethod('info'),
  api: createLogMethod('info'),
  epub: createLogMethod('info'),
  museum: createLogMethod('info'),
  
  // Utility: Check current configuration
  getConfig: () => ({
    level: LOG_LEVEL,
    isProduction,
  }),
};

export default logger;
