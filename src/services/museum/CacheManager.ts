
import { CachedMuseumData, MuseumItem } from './types';

export class CacheManager {
  private readonly CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
  private cache = new Map<string, CachedMuseumData>();

  isCacheValid(cached: CachedMuseumData): boolean {
    return Date.now() < cached.expiresAt;
  }

  setCacheData(key: string, data: MuseumItem[]): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });
  }

  getCachedData(key: string): MuseumItem[] | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached)) {
      console.log('🏛️ Museum: Using cached data');
      return cached.data;
    }
    return null;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🏛️ Museum: Cache cleared');
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}
