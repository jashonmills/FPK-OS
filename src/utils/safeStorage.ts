/**
 * Safe Storage Utilities
 * Provides error-resistant localStorage and sessionStorage operations
 */

export interface StorageOptions {
  fallbackValue?: any;
  logErrors?: boolean;
}

/**
 * Safe localStorage operations with error handling
 */
export const safeLocalStorage = {
  /**
   * Get item from localStorage with error handling
   */
  getItem: <T = string>(key: string, options: StorageOptions = {}): T | null => {
    const { fallbackValue = null, logErrors = true } = options;
    
    try {
      if (typeof window === 'undefined') {
        return fallbackValue;
      }
      
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return fallbackValue;
      }
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch (error) {
      if (logErrors) {
        console.warn(`Failed to read from localStorage key "${key}":`, error);
      }
      return fallbackValue;
    }
  },

  /**
   * Set item to localStorage with error handling
   */
  setItem: (key: string, value: any, options: StorageOptions = {}): boolean => {
    const { logErrors = true } = options;
    
    try {
      if (typeof window === 'undefined') {
        if (logErrors) {
          console.warn('localStorage not available in this environment');
        }
        return false;
      }
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      if (logErrors) {
        console.warn(`Failed to write to localStorage key "${key}":`, error);
      }
      return false;
    }
  },

  /**
   * Remove item from localStorage with error handling
   */
  removeItem: (key: string, options: StorageOptions = {}): boolean => {
    const { logErrors = true } = options;
    
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      if (logErrors) {
        console.warn(`Failed to remove localStorage key "${key}":`, error);
      }
      return false;
    }
  },

  /**
   * Clear localStorage with error handling
   */
  clear: (options: StorageOptions = {}): boolean => {
    const { logErrors = true } = options;
    
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      window.localStorage.clear();
      return true;
    } catch (error) {
      if (logErrors) {
        console.warn('Failed to clear localStorage:', error);
      }
      return false;
    }
  }
};

/**
 * Safe sessionStorage operations with error handling
 */
export const safeSessionStorage = {
  /**
   * Get item from sessionStorage with error handling
   */
  getItem: <T = string>(key: string, options: StorageOptions = {}): T | null => {
    const { fallbackValue = null, logErrors = true } = options;
    
    try {
      if (typeof window === 'undefined') {
        return fallbackValue;
      }
      
      const item = window.sessionStorage.getItem(key);
      
      if (item === null) {
        return fallbackValue;
      }
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as T;
      }
    } catch (error) {
      if (logErrors) {
        console.warn(`Failed to read from sessionStorage key "${key}":`, error);
      }
      return fallbackValue;
    }
  },

  /**
   * Set item to sessionStorage with error handling
   */
  setItem: (key: string, value: any, options: StorageOptions = {}): boolean => {
    const { logErrors = true } = options;
    
    try {
      if (typeof window === 'undefined') {
        if (logErrors) {
          console.warn('sessionStorage not available in this environment');
        }
        return false;
      }
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.sessionStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      if (logErrors) {
        console.warn(`Failed to write to sessionStorage key "${key}":`, error);
      }
      return false;
    }
  },

  /**
   * Remove item from sessionStorage with error handling
   */
  removeItem: (key: string, options: StorageOptions = {}): boolean => {
    const { logErrors = true } = options;
    
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      if (logErrors) {
        console.warn(`Failed to remove sessionStorage key "${key}":`, error);
      }
      return false;
    }
  }
};