
/**
 * Performance optimization utilities for the library components
 */

// Debounce utility for search and other frequent operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll and resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image lazy loading helper
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Memory cleanup helper for EPUB instances
export const cleanupEPUBResources = (epubInstance: any) => {
  try {
    if (epubInstance && typeof epubInstance.destroy === 'function') {
      epubInstance.destroy();
    }
  } catch (error) {
    console.warn('EPUB cleanup warning (non-critical):', error);
  }
};

// Request batching helper
export class RequestBatcher {
  private queue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private batchSize: number;
  private delay: number;

  constructor(batchSize = 3, delay = 100) {
    this.batchSize = batchSize;
    this.delay = delay;
  }

  add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      
      try {
        await Promise.allSettled(batch.map(request => request()));
      } catch (error) {
        console.warn('Batch processing error:', error);
      }
      
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }
    }
    
    this.isProcessing = false;
  }
}

// Global request batcher instance
export const globalRequestBatcher = new RequestBatcher(3, 200);

// Performance monitoring helper
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Resource priority helper for critical loading
export const prioritizeResource = (url: string, priority: 'high' | 'low' = 'high') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = 'fetch';
  if (priority === 'high') {
    link.setAttribute('importance', 'high');
  }
  document.head.appendChild(link);
};
