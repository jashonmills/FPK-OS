// Performance optimizer utilities to prevent browser crashes

interface TimeoutManager {
  timeouts: Set<NodeJS.Timeout>;
  intervals: Set<NodeJS.Timeout>;
  cleanup: () => void;
  setTimeout: (callback: () => void, delay: number) => NodeJS.Timeout;
  setInterval: (callback: () => void, delay: number) => NodeJS.Timeout;
}

// Global timeout manager to prevent accumulation
class GlobalTimeoutManager implements TimeoutManager {
  public timeouts = new Set<NodeJS.Timeout>();
  public intervals = new Set<NodeJS.Timeout>();

  setTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    // Limit maximum timeout duration to prevent memory issues
    const maxDelay = Math.min(delay, 300000); // Max 5 minutes
    
    const id = setTimeout(() => {
      try {
        callback();
      } catch (err) {
        console.warn('Timeout callback error:', err);
      } finally {
        this.timeouts.delete(id);
      }
    }, maxDelay);
    
    this.timeouts.add(id);
    
    // Auto-cleanup if too many timeouts
    if (this.timeouts.size > 50) {
      console.warn('Too many active timeouts, cleaning up oldest');
      this.cleanupOldest();
    }
    
    return id;
  }

  setInterval(callback: () => void, delay: number): NodeJS.Timeout {
    // Limit minimum interval to prevent browser strain
    const minDelay = Math.max(delay, 1000); // Min 1 second
    
    const id = setInterval(() => {
      try {
        callback();
      } catch (err) {
        console.warn('Interval callback error:', err);
      }
    }, minDelay);
    
    this.intervals.add(id);
    
    // Auto-cleanup if too many intervals
    if (this.intervals.size > 20) {
      console.warn('Too many active intervals, cleaning up oldest');
      this.cleanupIntervals();
    }
    
    return id;
  }

  private cleanupOldest(): void {
    let count = 0;
    for (const id of this.timeouts) {
      if (count++ >= 25) break; // Clear half
      clearTimeout(id);
      this.timeouts.delete(id);
    }
  }

  private cleanupIntervals(): void {
    let count = 0;
    for (const id of this.intervals) {
      if (count++ >= 10) break; // Clear half
      clearInterval(id);
      this.intervals.delete(id);
    }
  }

  cleanup(): void {
    // Clear all timeouts
    this.timeouts.forEach(id => {
      try {
        clearTimeout(id);
      } catch (err) {
        console.warn('Error clearing timeout:', err);
      }
    });
    this.timeouts.clear();

    // Clear all intervals
    this.intervals.forEach(id => {
      try {
        clearInterval(id);
      } catch (err) {
        console.warn('Error clearing interval:', err);
      }
    });
    this.intervals.clear();
  }
}

// Export singleton instance
export const timeoutManager = new GlobalTimeoutManager();

// Memory usage monitor
export const memoryMonitor = {
  checkMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1048576;
      const limitMB = memory.jsHeapSizeLimit / 1048576;
      
      if (usedMB > limitMB * 0.8) {
        console.warn('High memory usage detected:', usedMB.toFixed(2), 'MB');
        // Trigger cleanup
        timeoutManager.cleanup();
        
        // Force garbage collection if available
        if ('gc' in window) {
          (window as any).gc();
        }
      }
    }
  },

  startMonitoring(): NodeJS.Timeout | null {
    // Disabled to prevent browser freezes
    return null;
  }
};

// Event listener manager to prevent accumulation
export const eventListenerManager = {
  listeners: new Map<string, { element: EventTarget; event: string; handler: EventListener }>(),
  
  addEventListener(element: EventTarget, event: string, handler: EventListener, options?: AddEventListenerOptions): string {
    const id = `${event}_${Date.now()}_${Math.random()}`;
    element.addEventListener(event, handler, options);
    this.listeners.set(id, { element, event, handler });
    
    // Warn if too many listeners
    if (this.listeners.size > 100) {
      console.warn('Large number of event listeners detected:', this.listeners.size);
    }
    
    return id;
  },
  
  removeEventListener(id: string): void {
    const listener = this.listeners.get(id);
    if (listener) {
      listener.element.removeEventListener(listener.event, listener.handler);
      this.listeners.delete(id);
    }
  },
  
  cleanup(): void {
    this.listeners.forEach((listener, id) => {
      try {
        listener.element.removeEventListener(listener.event, listener.handler);
      } catch (err) {
        console.warn('Error removing event listener:', err);
      }
    });
    this.listeners.clear();
  }
};

// Memory monitoring disabled to prevent browser freezes
// memoryMonitor.startMonitoring();