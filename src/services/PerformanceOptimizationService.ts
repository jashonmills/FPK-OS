
/**
 * Performance Optimization Service
 * Enhanced with IndexedDB caching and streaming support
 */

import { indexedDBCache } from './IndexedDBCacheService';

interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate: number;
  immutable: boolean;
}

interface PrefetchConfig {
  enabled: boolean;
  popularBooksCount: number;
  searchPrefetchDelay: number;
  streamingEnabled: boolean;
}

interface PerformanceMetrics {
  cacheHitRate: number;
  averageLoadTime: number;
  streamingSuccessRate: number;
  indexedDBSize: number;
  networkRequests: number;
  bytesSaved: number;
}

class PerformanceOptimizationService {
  private prefetchConfig: PrefetchConfig = {
    enabled: true,
    popularBooksCount: 100,
    searchPrefetchDelay: 300,
    streamingEnabled: true
  };

  private cacheConfig: CacheConfig = {
    maxAge: 86400, // 24 hours
    staleWhileRevalidate: 3600, // 1 hour
    immutable: true
  };

  private preconnectDomains = [
    'https://www.gutenberg.org',
    'https://openlibrary.org',
    'https://covers.openlibrary.org',
    'https://zgcegkmqfgznbpdplscz.supabase.co'
  ];

  private prefetchedBooks = new Map<string, any>();
  private searchCache = new Map<string, any>();
  private performanceMetrics: PerformanceMetrics = {
    cacheHitRate: 0,
    averageLoadTime: 0,
    streamingSuccessRate: 0,
    indexedDBSize: 0,
    networkRequests: 0,
    bytesSaved: 0
  };

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

    this.initializePreconnections();
    this.setupEnhancedCacheHeaders();
    await this.loadPerformanceMetrics();

    console.log('✅ Enhanced performance service initialized');
  }

  /**
   * Initialize preconnections to external domains
   */
  private initializePreconnections(): void {
    if (typeof document === 'undefined') return;

    this.preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    console.log('✅ Preconnections established to:', this.preconnectDomains.length, 'domains');
  }

  /**
   * Setup enhanced cache headers with IndexedDB integration
   */
  private setupEnhancedCacheHeaders(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.href);
      
      // Check IndexedDB cache first for book assets
      if (this.isBookAsset(url)) {
        const cacheKey = this.generateCacheKey(url);
        const cached = await indexedDBCache.get(cacheKey);
        
        if (cached) {
          console.log('🎯 IndexedDB cache hit for:', url.substring(0, 50) + '...');
          this.performanceMetrics.cacheHitRate++;
          
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
        'Cache-Control': `public, max-age=${this.cacheConfig.maxAge}, stale-while-revalidate=${this.cacheConfig.staleWhileRevalidate}`,
        'X-Performance-Optimized': 'true',
        'X-Streaming-Supported': this.prefetchConfig.streamingEnabled ? 'true' : 'false'
      };

      this.performanceMetrics.networkRequests++;
      const startTime = performance.now();

      try {
        const response = await originalFetch(input, init);
        
        // Cache successful responses in IndexedDB
        if (response.ok && this.isBookAsset(url)) {
          const cacheKey = this.generateCacheKey(url);
          const responseClone = response.clone();
          
          // Cache response data
          const data = await responseClone.arrayBuffer();
          await indexedDBCache.set(cacheKey, {
            data,
            headers: Object.fromEntries(response.headers.entries()),
            cachedAt: Date.now()
          }, 'content');
          
          this.performanceMetrics.bytesSaved += data.byteLength;
        }

        const loadTime = performance.now() - startTime;
        this.updateAverageLoadTime(loadTime);

        return response;
      } catch (error) {
        console.warn('Fetch failed, checking cache fallback:', error);
        
        // Try cache fallback for critical resources
        if (this.isBookAsset(url)) {
          const cacheKey = this.generateCacheKey(url);
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

  /**
   * Check if URL is a book asset that should be cached
   */
  private isBookAsset(url: string): boolean {
    return url.includes('.epub') || 
           url.includes('.pdf') || 
           url.includes('covers.openlibrary.org') ||
           url.includes('gutenberg.org') ||
           url.includes('epub-proxy');
  }

  /**
   * Generate cache key for URL
   */
  private generateCacheKey(url: string): string {
    return `url:${btoa(url).substring(0, 50)}`;
  }

  /**
   * Enhanced prefetch with streaming support
   */
  async prefetchPopularBooks(books: any[]): Promise<void> {
    if (!this.prefetchConfig.enabled) return;

    const popularBooks = books.slice(0, this.prefetchConfig.popularBooksCount);
    
    console.log('🚀 Enhanced prefetching with streaming for', popularBooks.length, 'books...');
    
    const prefetchPromises = popularBooks.map(async (book) => {
      try {
        // Enhanced prefetch with metadata priority
        const prefetchData = {
          ...book,
          metadata: await this.prefetchBookMetadata(book),
          coverCached: await this.prefetchBookCover(book),
          streamingOptimized: this.prefetchConfig.streamingEnabled,
          prefetchedAt: Date.now()
        };
        
        this.prefetchedBooks.set(book.id, prefetchData);
        
        // Cache in IndexedDB for persistence
        await indexedDBCache.set(`prefetch:${book.id}`, prefetchData, 'metadata');
        
        return prefetchData;
      } catch (error) {
        console.warn('Enhanced prefetch failed for book:', book.id, error);
        return null;
      }
    });

    const results = await Promise.allSettled(prefetchPromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    
    console.log(`✅ Enhanced prefetch completed: ${successCount}/${popularBooks.length} books`);
    this.performanceMetrics.streamingSuccessRate = successCount / popularBooks.length;
  }

  /**
   * Prefetch book metadata for faster loading
   */
  private async prefetchBookMetadata(book: any): Promise<any> {
    try {
      if (book.epub_url) {
        // Quick metadata extraction without full download
        const metadataUrl = `${book.epub_url}?metadata_only=true`;
        const response = await fetch(metadataUrl, { 
          method: 'HEAD',
          timeout: 3000 
        });
        
        if (response.ok) {
          return {
            contentLength: response.headers.get('content-length'),
            lastModified: response.headers.get('last-modified'),
            etag: response.headers.get('etag'),
            supportsRanges: response.headers.get('accept-ranges') === 'bytes'
          };
        }
      }
      return null;
    } catch (error) {
      console.warn('Metadata prefetch failed:', error);
      return null;
    }
  }

  /**
   * Prefetch and cache book covers
   */
  private async prefetchBookCover(book: any): Promise<boolean> {
    try {
      if (book.cover_url) {
        const cacheKey = `cover:${book.id}`;
        
        // Check if already cached
        const cached = await indexedDBCache.get(cacheKey);
        if (cached) return true;

        // Prefetch cover
        const response = await fetch(book.cover_url);
        if (response.ok) {
          const coverData = await response.arrayBuffer();
          await indexedDBCache.set(cacheKey, {
            data: coverData,
            contentType: response.headers.get('content-type'),
            cachedAt: Date.now()
          }, 'cover');
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.warn('Cover prefetch failed:', error);
      return false;
    }
  }

  /**
   * Get prefetched book data with IndexedDB fallback
   */
  async getPrefetchedBook(bookId: string): Promise<any | null> {
    // Check memory cache first
    let book = this.prefetchedBooks.get(bookId);
    
    if (!book) {
      // Check IndexedDB cache
      book = await indexedDBCache.get(`prefetch:${bookId}`);
      if (book) {
        // Restore to memory cache
        this.prefetchedBooks.set(bookId, book);
      }
    }
    
    return book || null;
  }

  /**
   * Enhanced search caching with IndexedDB
   */
  async cacheSearchResults(query: string, results: any[]): Promise<void> {
    const cacheKey = `search:${query.toLowerCase()}`;
    
    // Cache in memory
    this.searchCache.set(cacheKey, results);
    
    // Cache in IndexedDB for persistence
    await indexedDBCache.set(cacheKey, {
      query,
      results,
      cachedAt: Date.now()
    }, 'metadata');
  }

  /**
   * Get cached search results with IndexedDB fallback
   */
  async getCachedSearchResults(query: string): Promise<any | null> {
    const cacheKey = `search:${query.toLowerCase()}`;
    
    // Check memory cache first
    let results = this.searchCache.get(cacheKey);
    
    if (!results) {
      // Check IndexedDB cache
      const cached = await indexedDBCache.get(cacheKey);
      if (cached && this.isSearchCacheFresh(cached)) {
        results = cached.results;
        // Restore to memory cache
        this.searchCache.set(cacheKey, results);
      }
    }
    
    return results || null;
  }

  private isSearchCacheFresh(cached: any): boolean {
    const age = Date.now() - cached.cachedAt;
    return age < 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Preload critical resources with streaming support
   */
  async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      '/pdf.worker.min.js',
      // Add streaming-specific resources
    ];

    const preloadPromises = criticalResources.map(async (resource) => {
      try {
        const response = await fetch(resource);
        if (response.ok) {
          const data = await response.arrayBuffer();
          await indexedDBCache.set(`resource:${resource}`, {
            data,
            contentType: response.headers.get('content-type'),
            cachedAt: Date.now()
          }, 'content');
        }
        return resource;
      } catch (error) {
        console.warn('Failed to preload:', resource, error);
        return null;
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log('✅ Critical resources preloaded with caching');
  }

  /**
   * Load performance metrics from IndexedDB
   */
  private async loadPerformanceMetrics(): Promise<void> {
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
  private async savePerformanceMetrics(): Promise<void> {
    try {
      await indexedDBCache.set('performance:metrics', {
        ...this.performanceMetrics,
        updatedAt: Date.now()
      }, 'metadata');
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  private updateAverageLoadTime(loadTime: number): void {
    if (this.performanceMetrics.averageLoadTime === 0) {
      this.performanceMetrics.averageLoadTime = loadTime;
    } else {
      this.performanceMetrics.averageLoadTime = 
        (this.performanceMetrics.averageLoadTime * 0.9) + (loadTime * 0.1);
    }
  }

  /**
   * Get enhanced performance metrics
   */
  async getMetrics() {
    const cacheStats = indexedDBCache.getStats();
    
    return {
      prefetchedBooksCount: this.prefetchedBooks.size,
      cachedSearchesCount: this.searchCache.size,
      preconnectDomains: this.preconnectDomains.length,
      indexedDBStats: cacheStats,
      performance: this.performanceMetrics,
      config: {
        prefetch: this.prefetchConfig,
        cache: this.cacheConfig
      },
      streamingEnabled: this.prefetchConfig.streamingEnabled
    };
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    this.prefetchedBooks.clear();
    this.searchCache.clear();
    await indexedDBCache.clear();
    
    // Reset metrics
    this.performanceMetrics = {
      cacheHitRate: 0,
      averageLoadTime: 0,
      streamingSuccessRate: 0,
      indexedDBSize: 0,
      networkRequests: 0,
      bytesSaved: 0
    };
    
    console.log('🧹 All caches cleared');
  }
}

// Global instance
export const performanceService = new PerformanceOptimizationService();
