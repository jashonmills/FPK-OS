
/**
 * Performance Optimization Service
 * Handles CDN caching, prefetch, preconnect, and resource optimization
 */

interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate: number;
  immutable: boolean;
}

interface PrefetchConfig {
  enabled: boolean;
  popularBooksCount: number;
  searchPrefetchDelay: number;
}

class PerformanceOptimizationService {
  private prefetchConfig: PrefetchConfig = {
    enabled: true,
    popularBooksCount: 100,
    searchPrefetchDelay: 300
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

  constructor() {
    this.initializePreconnections();
    this.setupCacheHeaders();
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
   * Setup optimized cache headers for requests
   */
  private setupCacheHeaders(): void {
    // Intercept fetch requests to add cache headers
    const originalFetch = window.fetch;
    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : input.url;
      
      // Add cache headers for book assets
      if (this.isBookAsset(url)) {
        init.headers = {
          ...init.headers,
          'Cache-Control': `public, max-age=${this.cacheConfig.maxAge}, stale-while-revalidate=${this.cacheConfig.staleWhileRevalidate}`,
          'X-Performance-Optimized': 'true'
        };
      }

      return originalFetch(input, init);
    };
  }

  /**
   * Check if URL is a book asset that should be cached
   */
  private isBookAsset(url: string): boolean {
    return url.includes('.epub') || 
           url.includes('.pdf') || 
           url.includes('covers.openlibrary.org') ||
           url.includes('gutenberg.org');
  }

  /**
   * Prefetch popular books metadata for instant search
   */
  async prefetchPopularBooks(books: any[]): Promise<void> {
    if (!this.prefetchConfig.enabled) return;

    const popularBooks = books.slice(0, this.prefetchConfig.popularBooksCount);
    
    console.log('🚀 Prefetching', popularBooks.length, 'popular books...');
    
    const prefetchPromises = popularBooks.map(async (book) => {
      try {
        // Prefetch book metadata
        this.prefetchedBooks.set(book.id, book);
        
        // Prefetch book cover if available
        if (book.cover_url) {
          const img = new Image();
          img.src = book.cover_url;
        }
        
        return book;
      } catch (error) {
        console.warn('Prefetch failed for book:', book.id, error);
        return null;
      }
    });

    const results = await Promise.allSettled(prefetchPromises);
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`✅ Prefetched ${successCount}/${popularBooks.length} books`);
  }

  /**
   * Get prefetched book data
   */
  getPrefetchedBook(bookId: string): any | null {
    return this.prefetchedBooks.get(bookId) || null;
  }

  /**
   * Prefetch search results based on popular queries
   */
  async prefetchSearchResults(popularQueries: string[]): Promise<void> {
    const prefetchPromises = popularQueries.map(async (query) => {
      try {
        // Simulate search API call - replace with actual search logic
        const cacheKey = `search:${query.toLowerCase()}`;
        if (!this.searchCache.has(cacheKey)) {
          // This would call your actual search function
          const results = await this.performSearch(query);
          this.searchCache.set(cacheKey, results);
        }
      } catch (error) {
        console.warn('Search prefetch failed for:', query, error);
      }
    });

    await Promise.allSettled(prefetchPromises);
    console.log('✅ Search results prefetched for', popularQueries.length, 'queries');
  }

  /**
   * Get cached search results
   */
  getCachedSearchResults(query: string): any | null {
    const cacheKey = `search:${query.toLowerCase()}`;
    return this.searchCache.get(cacheKey) || null;
  }

  /**
   * Placeholder for actual search implementation
   */
  private async performSearch(query: string): Promise<any> {
    // This would be replaced with actual search logic
    return [];
  }

  /**
   * Preload critical resources during app initialization
   */
  async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      '/pdf.worker.min.js', // PDF.js worker
      // Add other critical resources
    ];

    const preloadPromises = criticalResources.map(async (resource) => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'script';
        document.head.appendChild(link);
        
        return resource;
      } catch (error) {
        console.warn('Failed to preload:', resource, error);
        return null;
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log('✅ Critical resources preloaded');
  }

  /**
   * Optimize image loading with lazy loading and WebP support
   */
  optimizeImageLoading(imgElement: HTMLImageElement, src: string): void {
    // Add lazy loading
    imgElement.loading = 'lazy';
    
    // Add WebP support detection
    const supportsWebP = this.supportsWebP();
    if (supportsWebP && !src.includes('.webp')) {
      // Try WebP version first
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      imgElement.src = webpSrc;
      
      imgElement.onerror = () => {
        // Fallback to original format
        imgElement.src = src;
      };
    } else {
      imgElement.src = src;
    }
  }

  /**
   * Check WebP support
   */
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Clear caches to free memory
   */
  clearCaches(): void {
    this.prefetchedBooks.clear();
    this.searchCache.clear();
    console.log('🧹 Performance caches cleared');
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      prefetchedBooksCount: this.prefetchedBooks.size,
      cachedSearchesCount: this.searchCache.size,
      preconnectDomains: this.preconnectDomains.length,
      config: {
        prefetch: this.prefetchConfig,
        cache: this.cacheConfig
      }
    };
  }
}

// Global instance
export const performanceService = new PerformanceOptimizationService();
