/**
 * Centralized Logging System
 * Provides consistent logging across the application with environment-based filtering
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: any;
}

class Logger {
  private currentLogLevel: LogLevel;
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
    
    // Set log level based on environment
    this.currentLogLevel = this.isProduction 
      ? LogLevel.WARN 
      : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLogLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const prefix = context ? `[${context}]` : '';
    
    const formattedMessage = `${timestamp} ${levelName} ${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedMessage, data ? data : '');
        }
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data ? data : '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data ? data : '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data ? data : '');
        break;
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.formatMessage(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.formatMessage(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.formatMessage(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: any): void {
    this.formatMessage(LogLevel.ERROR, message, context, data);
  }

  // Convenience methods for common use cases
  auth(message: string, data?: any): void {
    this.debug(message, 'AUTH', data);
  }

  api(message: string, data?: any): void {
    this.debug(message, 'API', data);
  }

  performance(message: string, data?: any): void {
    this.debug(message, 'PERFORMANCE', data);
  }

  security(message: string, data?: any): void {
    this.warn(message, 'SECURITY', data);
  }

  cache(message: string, data?: any): void {
    this.debug(message, 'CACHE', data);
  }

  epub(message: string, data?: any): void {
    this.debug(message, 'EPUB', data);
  }

  museum(message: string, data?: any): void {
    this.debug(message, 'MUSEUM', data);
  }

  accessibility(message: string, data?: any): void {
    this.warn(message, 'ACCESSIBILITY', data);
  }

  // Method to change log level at runtime (useful for debugging)
  setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
    this.info(`Log level changed to ${LogLevel[level]}`);
  }

  // Method to get current log level
  getLogLevel(): LogLevel {
    return this.currentLogLevel;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenience
export default logger;