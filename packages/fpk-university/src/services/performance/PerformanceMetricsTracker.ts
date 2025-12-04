
/**
 * Performance Metrics Tracking
 */

import { indexedDBCache } from '../IndexedDBCacheService';

export interface PerformanceMetrics {
  cacheHitRate: number;
  averageLoadTime: number;
  streamingSuccessRate: number;
  indexedDBSize: number;
  networkRequests: number;
  bytesSaved: number;
}

export class PerformanceMetricsTracker {
  private performanceMetrics: PerformanceMetrics = {
    cacheHitRate: 0,
    averageLoadTime: 0,
    streamingSuccessRate: 0,
    indexedDBSize: 0,
    networkRequests: 0,
    bytesSaved: 0
  };

  /**
   * Load performance metrics from IndexedDB
   */
  async loadPerformanceMetrics(): Promise<void> {
    try {
      const cached = await indexedDBCache.get('performance:metrics');
      if (cached) {
        this.performanceMetrics = { ...this.performanceMetrics, ...cached };
      }
    } catch (error) {
      console.warn('Failed to load performance metrics:', error);
    }
  }

  /**
   * Save performance metrics to IndexedDB
   */
  async savePerformanceMetrics(): Promise<void> {
    try {
      await indexedDBCache.set('performance:metrics', {
        ...this.performanceMetrics,
        updatedAt: Date.now()
      }, 'metadata');
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  updateAverageLoadTime(loadTime: number): void {
    if (this.performanceMetrics.averageLoadTime === 0) {
      this.performanceMetrics.averageLoadTime = loadTime;
    } else {
      this.performanceMetrics.averageLoadTime = 
        (this.performanceMetrics.averageLoadTime * 0.9) + (loadTime * 0.1);
    }
  }

  incrementCacheHit(): void {
    this.performanceMetrics.cacheHitRate++;
  }

  incrementNetworkRequest(): void {
    this.performanceMetrics.networkRequests++;
  }

  addBytesSaved(bytes: number): void {
    this.performanceMetrics.bytesSaved += bytes;
  }

  setStreamingSuccessRate(rate: number): void {
    this.performanceMetrics.streamingSuccessRate = rate;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  resetMetrics(): void {
    this.performanceMetrics = {
      cacheHitRate: 0,
      averageLoadTime: 0,
      streamingSuccessRate: 0,
      indexedDBSize: 0,
      networkRequests: 0,
      bytesSaved: 0
    };
  }
}
