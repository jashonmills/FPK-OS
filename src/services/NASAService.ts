
export interface APODData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  thumbnail_url?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  service_version?: string;
}

export interface CachedAPODData {
  data: APODData | APODData[];
  timestamp: number;
  expiresAt: number;
}

class NASAService {
  private readonly API_KEY = 'DEMO_KEY';
  private readonly BASE_URL = 'https://api.nasa.gov/planetary/apod';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private cache = new Map<string, CachedAPODData>();

  private getCacheKey(params: Record<string, string | number>): string {
    return Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  private isCacheValid(cached: CachedAPODData): boolean {
    return Date.now() < cached.expiresAt;
  }

  private setCacheData(key: string, data: APODData | APODData[]): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });
  }

  private getCachedData(key: string): APODData | APODData[] | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached)) {
      console.log('🚀 NASA APOD: Using cached data');
      return cached.data;
    }
    return null;
  }

  async getTodaysAPOD(): Promise<APODData> {
    const cacheKey = this.getCacheKey({ today: new Date().toISOString().split('T')[0] });
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData && !Array.isArray(cachedData)) {
      return cachedData;
    }

    try {
      console.log('🚀 NASA APOD: Fetching today\'s image');
      const response = await fetch(`${this.BASE_URL}?api_key=${this.API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status} ${response.statusText}`);
      }

      const data: APODData = await response.json();
      this.setCacheData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('🚀 NASA APOD: Error fetching today\'s image:', error);
      throw new Error('Failed to fetch today\'s astronomy picture');
    }
  }

  async getRecentAPODs(count: number = 7): Promise<APODData[]> {
    const cacheKey = this.getCacheKey({ count });
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData && Array.isArray(cachedData)) {
      return cachedData;
    }

    try {
      console.log(`🚀 NASA APOD: Fetching ${count} recent images`);
      const response = await fetch(`${this.BASE_URL}?api_key=${this.API_KEY}&count=${count}`);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status} ${response.statusText}`);
      }

      const data: APODData[] = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      this.setCacheData(cacheKey, sortedData);
      return sortedData;
    } catch (error) {
      console.error('🚀 NASA APOD: Error fetching recent images:', error);
      throw new Error('Failed to fetch recent astronomy pictures');
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🚀 NASA APOD: Cache cleared');
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export const nasaService = new NASAService();
