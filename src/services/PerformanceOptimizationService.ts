
/**
 * Performance Optimization Service
 * Refactored into smaller, focused components
 */

import { indexedDBCache } from './IndexedDBCacheService';
import { CacheConfigManager, CacheConfig, PrefetchConfig } from './performance/CacheConfigManager';
import { PrefetchManager } from './performance/PrefetchManager';
import { PerformanceMetricsTracker, PerformanceMetrics } from './performance/PerformanceMetricsTracker';
import { ImageOptimizer } from './performance/ImageOptimizer';
import { sloMonitoringService } from './monitoring/SLOMonitoringService';

class PerformanceOptimizationService {
  private cacheConfigManager = new CacheConfigManager();
  private prefetchManager = new PrefetchManager();
  private metricsTracker = new PerformanceMetricsTracker();
  private imageOptimizer = new ImageOptimizer();

  constructor() {
    this.initializePerformance();
  }

  /**
   * Initialize performance optimizations with IndexedDB support
   */
  private async initializePerformance(): Promise<void> {
    console.log('🚀 Initializing enhanced performance service...');

    // Initialize IndexedDB cache
    const cacheReady = await indexedDBCache.initialize();
    if (!cacheReady) {
      console.warn('⚠️ IndexedDB cache initialization failed, using memory cache only');
    }

    this.cacheConfigManager.initializePreconnections();
    this.setupEnhancedCacheHeaders();
    await this.metricsTracker.loadPerformanceMetrics();

    console.log('✅ Enhanced performance service initialized with monitoring');
  }

  /**
   * Setup enhanced cache headers with IndexedDB integration
   */
  private setupEnhancedCacheHeaders(): void {
    const originalFetch = window.fetch;
    const cacheConfig = this.cacheConfigManager.getCacheConfig();
    const prefetchConfig = this.cacheConfigManager.getPrefetchConfig();
    
    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.href);
      
      // Check IndexedDB cache first for book assets
      if (this.cacheConfigManager.isBookAsset(url)) {
        const cacheKey = this.cacheConfigManager.generateCacheKey(url);
        const cached = await indexedDBCache.get(cacheKey);
        
        if (cached) {
          console.log('🎯 IndexedDB cache hit for:', url.substring(0, 50) + '...');
          this.metricsTracker.incrementCacheHit();
          
          // Return cached response
          return new Response(cached.data, {
            status: 200,
            headers: cached.headers || {}
          });
        }
      }

      // Add enhanced cache headers
      init.headers = {
        ...init.headers,
        'Cache-Control': `public, max-age=${cacheConfig.maxAge}, stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`,
        'X-Performance-Optimized': 'true',
        'X-Streaming-Supported': prefetchConfig.streamingEnabled ? 'true' : 'false'
      };

      this.metricsTracker.incrementNetworkRequest();
      const startTime = performance.now();

      try {
        const response = await originalFetch(input, init);
        
        // Cache successful responses in IndexedDB
        if (response.ok && this.cacheConfigManager.isBookAsset(url)) {
          const cacheKey = this.cacheConfigManager.generateCacheKey(url);
          const responseClone = response.clone();
          
          // Cache response data
          const data = await responseClone.arrayBuffer();
          await indexedDBCache.set(cacheKey, {
            data,
            headers: Object.fromEntries(response.headers.entries()),
            cachedAt: Date.now()
          }, 'content');
          
          this.metricsTracker.addBytesSaved(data.byteLength);
        }

        const loadTime = performance.now() - startTime;
        this.metricsTracker.updateAverageLoadTime(loadTime);

        // Track performance metrics for monitoring
        if (url.includes('.epub') || url.includes('.pdf')) {
          sloMonitoringService['webVitalsTracker'].recordCustomMetric('document_load_time', loadTime);
        }

        return response;
      } catch (error) {
        console.warn('Fetch failed, checking cache fallback:', error);
        
        // Try cache fallback for critical resources
        if (this.cacheConfigManager.isBookAsset(url)) {
          const cacheKey = this.cacheConfigManager.generateCacheKey(url);
          const cached = await indexedDBCache.get(cacheKey);
          
          if (cached) {
            console.log('🔄 Using cache fallback for:', url.substring(0, 50) + '...');
            return new Response(cached.data, {
              status: 200,
              headers: cached.headers || {}
            });
          }
        }
        
        throw error;
      }
    };
  }

  // Delegate methods to component managers
  async prefetchPopularBooks(books: any[]): Promise<void> {
    const prefetchConfig = this.cacheConfigManager.getPrefetchConfig();
    const successRate = await this.prefetchManager.prefetchPopularBooks(
      books, 
      prefetchConfig.popularBooksCount, 
      prefetchConfig.streamingEnabled
    );
    this.metricsTracker.setStreamingSuccessRate(successRate);
  }

  async getPrefetchedBook(bookId: string): Promise<any | null> {
    return this.prefetchManager.getPrefetchedBook(bookId);
  }

  async cacheSearchResults(query: string, results: any[]): Promise<void> {
    return this.prefetchManager.cacheSearchResults(query, results);
  }

  async getCachedSearchResults(query: string): Promise<any | null> {
    return this.prefetchManager.getCachedSearchResults(query);
  }

  async prefetchSearchResults(queries: string[]): Promise<void> {
    return this.prefetchManager.prefetchSearchResults(queries);
  }

  optimizeImageLoading(img: HTMLImageElement, src: string): void {
    this.imageOptimizer.optimizeImageLoading(img, src);
  }

  async preloadCriticalResources(): Promise<void> {
    return this.imageOptimizer.preloadCriticalResources();
  }

  /**
   * Get enhanced performance metrics with monitoring data
   */
  async getMetrics() {
    const cacheStats = indexedDBCache.getStats();
    const prefetchStats = this.prefetchManager.getPrefetchStats();
    const performanceMetrics = this.metricsTracker.getMetrics();
    const cacheConfig = this.cacheConfigManager.getCacheConfig();
    const prefetchConfig = this.cacheConfigManager.getPrefetchConfig();
    const monitoringData = sloMonitoringService.getDashboardData();
    
    return {
      ...prefetchStats,
      preconnectDomains: this.cacheConfigManager.getPreconnectDomains().length,
      indexedDBStats: cacheStats,
      performance: performanceMetrics,
      config: {
        prefetch: prefetchConfig,
        cache: cacheConfig
      },
      streamingEnabled: prefetchConfig.streamingEnabled,
      monitoring: {
        sloStatus: monitoringData.sloStatus,
        webVitals: monitoringData.webVitals,
        alerts: monitoringData.alerts
      }
    };
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    this.prefetchManager.clearCaches();
    await indexedDBCache.clear();
    this.metricsTracker.resetMetrics();
    
    console.log('🧹 All caches cleared');
  }
}

// Global instance
export const performanceService = new PerformanceOptimizationService();
