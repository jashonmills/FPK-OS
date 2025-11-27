// Memory management utilities to prevent browser crashes

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
}

class MemoryManager {
  private checkInterval: NodeJS.Timeout | null = null;
  private warningThreshold = 0.75; // 75% memory usage
  private criticalThreshold = 0.9; // 90% memory usage
  private callbacks: Set<() => void> = new Set();

  constructor() {
    this.startMonitoring();
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): MemoryStats | null {
    if (!('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
    };
  }

  /**
   * Check if memory usage is critical
   */
  isMemoryLow(): boolean {
    const stats = this.getMemoryStats();
    return stats ? stats.usagePercentage > this.criticalThreshold : false;
  }

  /**
   * Check if memory usage is high (warning level)
   */
  isMemoryHigh(): boolean {
    const stats = this.getMemoryStats();
    return stats ? stats.usagePercentage > this.warningThreshold : false;
  }

  /**
   * Register callback for memory pressure events
   */
  onMemoryPressure(callback: () => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Force garbage collection if available
   */
  forceGC(): void {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      try {
        (window as any).gc();
        console.log('🗑️ Forced garbage collection');
      } catch (err) {
        console.warn('Could not force garbage collection:', err);
      }
    }
  }

  /**
   * Clean up large objects and caches
   */
  private triggerCleanup(): void {
    console.warn('⚠️ High memory usage detected, triggering cleanup');
    
    // Notify all registered callbacks
    this.callbacks.forEach(callback => {
      try {
        callback();
      } catch (err) {
        console.error('Error in memory cleanup callback:', err);
      }
    });

    // Force garbage collection
    this.forceGC();

    // Clear some browser caches if possible
    try {
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('temp') || name.includes('cache')) {
              caches.delete(name);
            }
          });
        });
      }
    } catch (err) {
      console.warn('Could not clear caches:', err);
    }
  }

  /**
   * Start monitoring memory usage - DISABLED to prevent freezing
   */
  private startMonitoring(): void {
    // Disabled memory monitoring as it was causing browser freezes
    return;
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Get human-readable memory info
   */
  getMemoryInfo(): string {
    const stats = this.getMemoryStats();
    if (!stats) return 'Memory info not available';

    const formatBytes = (bytes: number) => {
      const mb = bytes / (1024 * 1024);
      return `${mb.toFixed(1)} MB`;
    };

    return [
      `Used: ${formatBytes(stats.usedJSHeapSize)}`,
      `Total: ${formatBytes(stats.totalJSHeapSize)}`,
      `Limit: ${formatBytes(stats.jsHeapSizeLimit)}`,
      `Usage: ${(stats.usagePercentage * 100).toFixed(1)}%`
    ].join(', ');
  }
}

// Export singleton instance
export const memoryManager = new MemoryManager();

// Array and object size limiters to prevent memory issues
export const safeLimits = {
  /**
   * Limit array size to prevent memory issues
   */
  limitArray<T>(array: T[], maxSize: number = 1000): T[] {
    if (array.length <= maxSize) return array;
    console.warn(`Array size limited from ${array.length} to ${maxSize}`);
    return array.slice(-maxSize); // Keep most recent items
  },

  /**
   * Limit object properties to prevent memory issues  
   */
  limitObject<T extends Record<string, any>>(obj: T, maxKeys: number = 1000): T {
    const keys = Object.keys(obj);
    if (keys.length <= maxKeys) return obj;
    
    console.warn(`Object keys limited from ${keys.length} to ${maxKeys}`);
    const limitedKeys = keys.slice(-maxKeys);
    const limitedObj = {} as T;
    
    limitedKeys.forEach(key => {
      limitedObj[key as keyof T] = obj[key];
    });
    
    return limitedObj;
  },

  /**
   * Check if processing large data would be safe
   */
  canProcessLargeData(estimatedSizeMB: number): boolean {
    const stats = memoryManager.getMemoryStats();
    if (!stats) return true; // Can't check, assume it's fine
    
    const availableMB = (stats.jsHeapSizeLimit - stats.usedJSHeapSize) / (1024 * 1024);
    const safetyMargin = 0.5; // 50% safety margin
    
    return estimatedSizeMB < (availableMB * safetyMargin);
  }
};

// Auto-cleanup disabled to prevent browser freezes
// memoryManager.onMemoryPressure(() => {
//   console.log('🧹 Running global memory cleanup');
//   if ('performance' in window && 'clearMarks' in performance) {
//     performance.clearMarks();
//     performance.clearMeasures();
//   }
// });