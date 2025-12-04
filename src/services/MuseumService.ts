
import { MuseumItem } from './museum/types';
import { CacheManager } from './museum/CacheManager';
import { MetMuseumAPI } from './museum/MetMuseumAPI';
import { SmithsonianAPI } from './museum/SmithsonianAPI';
import { FALLBACK_ITEMS } from './museum/FallbackData';

class MuseumService {
  private cacheManager = new CacheManager();
  private metAPI: MetMuseumAPI;
  private smithsonianAPI: SmithsonianAPI;

  constructor() {
    const config = {
      timeout: 10000,
      maxRetries: 2
    };
    
    this.metAPI = new MetMuseumAPI(config);
    this.smithsonianAPI = new SmithsonianAPI(config);
  }

  async getVisualOfTheWeek(): Promise<MuseumItem[]> {
    const cacheKey = 'visual-of-the-week';
    
    // Check cache first
    const cachedData = this.cacheManager.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    console.log('🏛️ Museum: Fetching fresh visual of the week data');

    try {
      // Try to fetch from both APIs in parallel
      const [metItems, smithsonianItems] = await Promise.allSettled([
        this.metAPI.fetchItems().catch(err => {
          console.warn('🏛️ Museum: Met API failed:', err);
          return [];
        }),
        this.smithsonianAPI.fetchItems().catch(err => {
          console.warn('🏛️ Museum: Smithsonian API failed:', err);
          return [];
        })
      ]);

      const allItems: MuseumItem[] = [];
      
      if (metItems.status === 'fulfilled') {
        allItems.push(...metItems.value);
      }
      
      if (smithsonianItems.status === 'fulfilled') {
        allItems.push(...smithsonianItems.value);
      }

      // If we have some real items, mix with fallback items
      if (allItems.length > 0) {
        console.log(`🏛️ Museum: Got ${allItems.length} real items from APIs`);
        
        // Mix real items with selected fallback items for variety
        const mixedItems = [...allItems, ...FALLBACK_ITEMS.slice(0, 3)];
        
        // Shuffle and take up to 7 items
        const shuffledItems = this.shuffleArray(mixedItems).slice(0, 7);
        
        this.cacheManager.setCacheData(cacheKey, shuffledItems);
        return shuffledItems;
      } else {
        console.warn('🏛️ Museum: No real items available, using fallback data only');
        this.cacheManager.setCacheData(cacheKey, FALLBACK_ITEMS);
        return FALLBACK_ITEMS;
      }
    } catch (error) {
      console.error('🏛️ Museum: Error fetching visual of the week:', error);
      this.cacheManager.setCacheData(cacheKey, FALLBACK_ITEMS);
      return FALLBACK_ITEMS;
    }
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
    this.cacheManager.clearCache();
  }

  getCacheStats(): { size: number; entries: string[] } {
    return this.cacheManager.getCacheStats();
  }
}

// Export singleton instance
export const museumService = new MuseumService();

// Export types for other components to use
export type { MuseumItem } from './museum/types';
