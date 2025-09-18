// src/utils/logger.ts

type Json = Record<string, unknown>;
export type Level = 'info' | 'warn' | 'error' | 'debug';

/**
 * Minimal logger used across the app.
 * - Keeps a named export `logger` for existing imports:
 *     import { logger } from '@/utils/logger'
 * - Also provides a default export for future flexibility:
 *     import logger from '@/utils/logger'
 * No side effects; safe for server and client.
 */
export const logger = {
  info: (message: string, payload?: Json) =>
    console.info('[info]', message, payload),
  warn: (message: string, payload?: Json) =>
    console.warn('[warn]', message, payload),
  error: (message: string, payload?: Json) =>
    console.error('[error]', message, payload),
  debug: (message: string, payload?: Json) =>
    console.debug('[debug]', message, payload),
};

export default logger;
