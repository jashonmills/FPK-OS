// src/utils/logger.ts

type Json = Record<string, unknown>;
export type Level = 'info' | 'warn' | 'error' | 'debug';

/**
 * Comprehensive logger used across the app.
 * Supports both 2-argument (message, payload) and 3-argument (message, category, payload) patterns
 * No side effects; safe for server and client.
 */
const createLogMethod = (level: 'info' | 'warn' | 'error' | 'debug') => 
  (message: string, categoryOrPayload?: string | Json | any, payload?: Json | any) => {
    if (typeof categoryOrPayload === 'string') {
      // 3-argument pattern: message, category, payload
      console[level](`[${level}][${categoryOrPayload}]`, message, payload);
    } else {
      // 2-argument pattern: message, payload
      console[level](`[${level}]`, message, categoryOrPayload);
    }
  };

export const logger = {
  info: createLogMethod('info'),
  warn: createLogMethod('warn'), 
  error: createLogMethod('error'),
  debug: createLogMethod('debug'),
  // Additional specialized loggers used throughout the app
  performance: createLogMethod('info'),
  auth: createLogMethod('info'),
  accessibility: createLogMethod('info'),
  api: createLogMethod('info'),
  epub: createLogMethod('info'),
  museum: createLogMethod('info'),
};

export default logger;
