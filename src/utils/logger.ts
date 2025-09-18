// Comprehensive logger implementation
const createCategoryLogger = (category: string) => {
  const categoryLogger = (message: string, ...args: any[]) => {
    console.info(`[${category}] ${message}`, ...args);
  };
  
  categoryLogger.info = (message: string, ...args: any[]) => console.info(`[${category}] ${message}`, ...args);
  categoryLogger.warn = (message: string, ...args: any[]) => console.warn(`[${category}] ${message}`, ...args);
  categoryLogger.error = (message: string, ...args: any[]) => console.error(`[${category}] ${message}`, ...args);
  categoryLogger.debug = (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${category}] ${message}`, ...args);
    }
  };
  
  return categoryLogger;
};

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  log: (message: string, ...args: any[]) => {
    console.log(`[LOG] ${message}`, ...args);
  },
  // Category-specific loggers that are both callable and have methods
  performance: createCategoryLogger('PERFORMANCE'),
  auth: createCategoryLogger('AUTH'),
  accessibility: createCategoryLogger('ACCESSIBILITY'),
  api: createCategoryLogger('API'),
  epub: createCategoryLogger('EPUB'),
  museum: createCategoryLogger('MUSEUM')
};

export default logger;