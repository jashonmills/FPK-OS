
/**
 * Cache Configuration and Management
 */

export interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate: number;
  immutable: boolean;
}

export interface PrefetchConfig {
  enabled: boolean;
  popularBooksCount: number;
  searchPrefetchDelay: number;
  streamingEnabled: boolean;
}

export class CacheConfigManager {
  private cacheConfig: CacheConfig = {
    maxAge: 86400, // 24 hours
    staleWhileRevalidate: 3600, // 1 hour
    immutable: true
  };

  private prefetchConfig: PrefetchConfig = {
    enabled: true,
    popularBooksCount: 100,
    searchPrefetchDelay: 300,
    streamingEnabled: true
  };

  private preconnectDomains = [
    'https://www.gutenberg.org',
    'https://openlibrary.org',
    'https://covers.openlibrary.org',
    'https://zgcegkmqfgznbpdplscz.supabase.co'
  ];

  getCacheConfig(): CacheConfig {
    return { ...this.cacheConfig };
  }

  getPrefetchConfig(): PrefetchConfig {
    return { ...this.prefetchConfig };
  }

  getPreconnectDomains(): string[] {
    return [...this.preconnectDomains];
  }

  /**
   * Initialize preconnections to external domains
   */
  initializePreconnections(): void {
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
   * Check if URL is a book asset that should be cached
   */
  isBookAsset(url: string): boolean {
    return url.includes('.epub') || 
           url.includes('.pdf') || 
           url.includes('covers.openlibrary.org') ||
           url.includes('gutenberg.org') ||
           url.includes('epub-proxy');
  }

  /**
   * Generate cache key for URL
   */
  generateCacheKey(url: string): string {
    return `url:${btoa(url).substring(0, 50)}`;
  }
}
