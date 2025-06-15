
/**
 * Prefetch Management for Books and Search Results
 */

import { indexedDBCache } from '../IndexedDBCacheService';

export class PrefetchManager {
  private prefetchedBooks = new Map<string, any>();
  private searchCache = new Map<string, any>();

  /**
   * Enhanced prefetch with streaming support
   */
  async prefetchPopularBooks(books: any[], popularBooksCount: number, streamingEnabled: boolean): Promise<void> {
    const popularBooks = books.slice(0, popularBooksCount);
    
    console.log('🚀 Enhanced prefetching with streaming for', popularBooks.length, 'books...');
    
    const prefetchPromises = popularBooks.map(async (book) => {
      try {
        // Enhanced prefetch with metadata priority
        const prefetchData = {
          ...book,
          metadata: await this.prefetchBookMetadata(book),
          coverCached: await this.prefetchBookCover(book),
          streamingOptimized: streamingEnabled,
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
    return successCount / popularBooks.length;
  }

  /**
   * Prefetch book metadata for faster loading
   */
  private async prefetchBookMetadata(book: any): Promise<any> {
    try {
      if (book.epub_url) {
        // Quick metadata extraction without full download
        const metadataUrl = `${book.epub_url}?metadata_only=true`;
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(metadataUrl, { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
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

  /**
   * Prefetch search results for popular queries
   */
  async prefetchSearchResults(queries: string[]): Promise<void> {
    console.log('🔍 Prefetching search results for popular queries...');
    
    for (const query of queries) {
      try {
        // Check if already cached
        const cached = await this.getCachedSearchResults(query);
        if (cached) continue;
        
        // This would typically make an API call to prefetch results
        console.log(`📝 Would prefetch results for: "${query}"`);
      } catch (error) {
        console.warn(`Failed to prefetch search for "${query}":`, error);
      }
    }
  }

  private isSearchCacheFresh(cached: any): boolean {
    const age = Date.now() - cached.cachedAt;
    return age < 30 * 60 * 1000; // 30 minutes
  }

  getPrefetchStats() {
    return {
      prefetchedBooksCount: this.prefetchedBooks.size,
      cachedSearchesCount: this.searchCache.size
    };
  }

  clearCaches(): void {
    this.prefetchedBooks.clear();
    this.searchCache.clear();
  }
}
