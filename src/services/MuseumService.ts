
export interface MuseumItem {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  sourceAttribution: string;
  embedUrl?: string;
  isThreeD: boolean;
  source: 'smithsonian' | 'met';
}

export interface CachedMuseumData {
  data: MuseumItem[];
  timestamp: number;
  expiresAt: number;
}

class MuseumService {
  private readonly SI_API_KEY = 'DEMO_KEY'; // Using demo key for now
  private readonly CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
  private cache = new Map<string, CachedMuseumData>();

  private getCacheKey(source: string): string {
    return `museum_${source}_weekly`;
  }

  private isCacheValid(cached: CachedMuseumData): boolean {
    return Date.now() < cached.expiresAt;
  }

  private setCacheData(key: string, data: MuseumItem[]): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });
    
    // Also store in localStorage
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION
      }));
    } catch (error) {
      console.warn('Failed to cache museum data to localStorage:', error);
    }
  }

  private getCachedData(key: string): MuseumItem[] | null {
    // Check memory cache first
    const memoryCache = this.cache.get(key);
    if (memoryCache && this.isCacheValid(memoryCache)) {
      console.log('🏛️ Museum: Using memory cached data');
      return memoryCache.data;
    }

    // Check localStorage
    try {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          console.log('🏛️ Museum: Using localStorage cached data');
          this.cache.set(key, parsed); // Restore to memory
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Failed to read cached museum data:', error);
    }

    return null;
  }

  async getVisualOfTheWeek(): Promise<MuseumItem[]> {
    const cacheKey = this.getCacheKey('visual_week');
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // Try Smithsonian first
      const smithsonianItems = await this.fetchSmithsonianItems();
      if (smithsonianItems.length >= 3) {
        const finalItems = [...smithsonianItems];
        
        // Fill remaining slots with Met items if needed
        if (finalItems.length < 7) {
          const metItems = await this.fetchMetItems(7 - finalItems.length);
          finalItems.push(...metItems);
        }

        const result = finalItems.slice(0, 7);
        this.setCacheData(cacheKey, result);
        return result;
      }

      // Fallback to Met if Smithsonian fails
      const metItems = await this.fetchMetItems(7);
      this.setCacheData(cacheKey, metItems);
      return metItems;
    } catch (error) {
      console.error('🏛️ Museum: Error fetching visual of the week:', error);
      throw new Error('Failed to fetch museum items');
    }
  }

  private async fetchSmithsonianItems(): Promise<MuseumItem[]> {
    console.log('🏛️ Museum: Fetching Smithsonian 3D models');
    
    const response = await fetch(
      `https://api.si.edu/openaccess/api/v1.0/search?q=online_media_type:"3D Model"&rows=5&api_key=${this.SI_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Smithsonian API error: ${response.status}`);
    }

    const data = await response.json();
    const items: MuseumItem[] = [];

    for (const item of data.response?.rows || []) {
      try {
        const content = item.content || {};
        const descriptiveNonRepeating = content.descriptiveNonRepeating || {};
        const onlineMedia = descriptiveNonRepeating.online_media?.media || [];

        const thumbnail = onlineMedia.find((media: any) => 
          media.type === 'Images' && media.thumbnail
        )?.thumbnail || onlineMedia[0]?.thumbnail;

        const title = content.freetext?.name?.[0]?.content || 
                     descriptiveNonRepeating.title?.content || 
                     'Untitled 3D Model';

        const description = content.freetext?.notes?.[0]?.content || 
                           content.freetext?.physicalDescription?.[0]?.content || 
                           'A fascinating 3D artifact from the Smithsonian collection.';

        if (thumbnail && title) {
          items.push({
            id: item.id || crypto.randomUUID(),
            title: title.substring(0, 100),
            thumbnail,
            description: description.substring(0, 200),
            sourceAttribution: 'Smithsonian Institution',
            embedUrl: onlineMedia.find((media: any) => media.type === '3D Model')?.content || '',
            isThreeD: true,
            source: 'smithsonian'
          });
        }
      } catch (error) {
        console.warn('Error processing Smithsonian item:', error);
      }
    }

    return items;
  }

  private async fetchMetItems(count: number): Promise<MuseumItem[]> {
    console.log(`🏛️ Museum: Fetching ${count} Met Museum items`);
    
    // Get random object IDs
    const idsResponse = await fetch(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects?hasImages=true&q=sculpture'
    );
    
    if (!idsResponse.ok) {
      throw new Error(`Met API error: ${idsResponse.status}`);
    }

    const idsData = await idsResponse.json();
    const objectIDs = idsData.objectIDs || [];
    
    if (objectIDs.length === 0) {
      return [];
    }

    // Get random selection
    const randomIds = this.shuffleArray(objectIDs).slice(0, count);
    const items: MuseumItem[] = [];

    for (const objectID of randomIds) {
      try {
        const response = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
        );
        
        if (!response.ok) continue;
        
        const item = await response.json();
        
        if (item.primaryImage && item.title) {
          items.push({
            id: `met_${objectID}`,
            title: item.title.substring(0, 100),
            thumbnail: item.primaryImageSmall || item.primaryImage,
            description: this.buildMetDescription(item),
            sourceAttribution: `The Metropolitan Museum of Art, ${item.creditLine || 'New York'}`,
            isThreeD: false,
            source: 'met'
          });
        }
      } catch (error) {
        console.warn(`Error fetching Met object ${objectID}:`, error);
      }
    }

    return items;
  }

  private buildMetDescription(item: any): string {
    const parts = [];
    if (item.medium) parts.push(item.medium);
    if (item.dimensions) parts.push(item.dimensions);
    if (item.period) parts.push(`Period: ${item.period}`);
    if (item.culture) parts.push(`Culture: ${item.culture}`);
    
    return parts.join('. ').substring(0, 200) || 'A remarkable piece from The Metropolitan Museum of Art collection.';
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  clearCache(): void {
    this.cache.clear();
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('museum_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear museum cache from localStorage:', error);
    }
    console.log('🏛️ Museum: Cache cleared');
  }
}

export const museumService = new MuseumService();
