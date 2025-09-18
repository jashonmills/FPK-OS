// src/utils/logger.ts
// Minimal, safe logger that works in browser and Node.
// Exports both a named `logger` and a default export for compatibility.

export type Json = Record<string, unknown>;
export type Level = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  info:  (message: string, payload?: Json) => console.info('[info]',  message, payload),
  warn:  (message: string, payload?: Json) => console.warn('[warn]',  message, payload),
  error: (message: string, payload?: Json) => console.error('[error]', message, payload),
  debug: (message: string, payload?: Json) => console.debug('[debug]', message, payload),
};

export type Logger = typeof logger;
export default logger;
