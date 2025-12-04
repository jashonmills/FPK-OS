// Conservative typing-only copy
import { indexedDBCache } from '../../IndexedDBCacheService';

export class PrefetchManager {
  private prefetchedBooks = new Map<string, unknown>();
  private searchCache = new Map<string, unknown>();

  async prefetchPopularBooks(books: unknown[], popularBooksCount: number, streamingEnabled: boolean): Promise<number> {
    const popularBooks = (books as any[]).slice(0, popularBooksCount);
    
    const prefetchPromises = popularBooks.map(async (book: any) => {
      try {
        const prefetchData = {
          ...book,
          metadata: await this.prefetchBookMetadata(book),
          coverCached: await this.prefetchBookCover(book),
          streamingOptimized: streamingEnabled,
          prefetchedAt: Date.now()
        };
        
        this.prefetchedBooks.set(book.id, prefetchData as unknown);
        await indexedDBCache.set(`prefetch:${book.id}`, prefetchData, 'metadata');
        return prefetchData;
      } catch {
        return null;
      }
    });

    const results: Array<any> = await Promise.allSettled(prefetchPromises) as any;
    const successCount = results.filter((r: any) => r.status === 'fulfilled' && r.value).length;
    return successCount / popularBooks.length;
  }

  private async prefetchBookMetadata(book: any): Promise<Record<string, unknown> | null> {
    try {
      if (book.epub_url) {
        const metadataUrl = `${book.epub_url}?metadata_only=true`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(metadataUrl, { method: 'HEAD', signal: controller.signal });
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
    } catch {
      return null;
    }
  }

  private async prefetchBookCover(book: any): Promise<boolean> {
    try {
      if (book.cover_url) {
        const cacheKey = `cover:${book.id}`;
        const cached = await indexedDBCache.get(cacheKey);
        if (cached) return true;
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
    } catch {
      return false;
    }
  }

  async getPrefetchedBook(bookId: string): Promise<unknown | null> {
    let book = this.prefetchedBooks.get(bookId);
    if (!book) {
      book = await indexedDBCache.get(`prefetch:${bookId}`);
      if (book) this.prefetchedBooks.set(bookId, book as unknown);
    }
    return book || null;
  }

  async cacheSearchResults(query: string, results: unknown[]): Promise<void> {
    const cacheKey = `search:${query.toLowerCase()}`;
    this.searchCache.set(cacheKey, results as unknown);
    await indexedDBCache.set(cacheKey, {
      query,
      results,
      cachedAt: Date.now()
    }, 'metadata');
  }

  async getCachedSearchResults(query: string): Promise<unknown | null> {
    const cacheKey = `search:${query.toLowerCase()}`;
    let results = this.searchCache.get(cacheKey) as unknown[] | undefined;
    if (!results) {
      const cached = await indexedDBCache.get(cacheKey);
      if (cached && (cached as any).cachedAt && this.isSearchCacheFresh(cached as any)) {
        results = (cached as any).results;
        this.searchCache.set(cacheKey, results as unknown);
      }
    }
    return (results as unknown) || null;
  }

  private isSearchCacheFresh(cached: any): boolean {
    const age = Date.now() - cached.cachedAt;
    return age < 30 * 60 * 1000;
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
