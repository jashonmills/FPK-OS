
export interface MuseumItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  modelUrl?: string;
  embedUrl?: string;
  source: 'smithsonian' | 'met';
  isThreeD: boolean;
  metadata?: {
    artist?: string;
    date?: string;
    medium?: string;
    dimensions?: string;
    culture?: string;
  };
}

export interface CachedMuseumData {
  data: MuseumItem[];
  timestamp: number;
  expiresAt: number;
}

class MuseumService {
  private readonly SMITHSONIAN_API_KEY = 'DEMO_KEY';
  private readonly SMITHSONIAN_BASE_URL = 'https://api.si.edu/openaccess/api/v1.0';
  private readonly MET_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';
  private readonly CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
  private cache = new Map<string, CachedMuseumData>();

  // Fallback data for when APIs are unavailable
  private readonly FALLBACK_ITEMS: MuseumItem[] = [
    {
      id: 'fallback-1',
      title: 'Ancient Greek Amphora',
      description: 'A beautifully preserved ancient Greek amphora featuring intricate geometric patterns and mythological scenes.',
      thumbnail: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop',
      source: 'met',
      isThreeD: false,
      metadata: {
        artist: 'Unknown',
        date: '5th century BCE',
        medium: 'Terracotta',
        culture: 'Greek'
      }
    },
    {
      id: 'fallback-2',
      title: 'Roman Marble Sculpture',
      description: 'A classical Roman marble sculpture depicting a figure from mythology, showcasing the mastery of ancient sculptors.',
      thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop',
      source: 'smithsonian',
      isThreeD: true,
      metadata: {
        artist: 'Unknown Roman Artist',
        date: '2nd century CE',
        medium: 'Marble'
      }
    },
    {
      id: 'fallback-3',
      title: 'Egyptian Canopic Jar',
      description: 'An ancient Egyptian canopic jar used in the mummification process, decorated with hieroglyphic inscriptions.',
      thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d03f6f?w=400&h=300&fit=crop',
      source: 'met',
      isThreeD: false,
      metadata: {
        date: 'New Kingdom Period',
        medium: 'Limestone',
        culture: 'Egyptian'
      }
    },
    {
      id: 'fallback-4',
      title: 'Medieval Illuminated Manuscript',
      description: 'A page from a medieval illuminated manuscript featuring gold leaf and vibrant pigments.',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      source: 'smithsonian',
      isThreeD: false,
      metadata: {
        date: '13th century',
        medium: 'Parchment, gold leaf, tempera',
        culture: 'European'
      }
    },
    {
      id: 'fallback-5',
      title: 'Asian Porcelain Vase',
      description: 'An exquisite porcelain vase from the Ming Dynasty, featuring delicate blue and white patterns.',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      source: 'met',
      isThreeD: true,
      metadata: {
        date: 'Ming Dynasty (1368-1644)',
        medium: 'Porcelain',
        culture: 'Chinese'
      }
    },
    {
      id: 'fallback-6',
      title: 'Native American Pottery',
      description: 'Traditional Native American pottery featuring geometric designs and natural earth tones.',
      thumbnail: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop',
      source: 'smithsonian',
      isThreeD: false,
      metadata: {
        date: '19th century',
        medium: 'Clay',
        culture: 'Native American'
      }
    },
    {
      id: 'fallback-7',
      title: 'Renaissance Bronze Medallion',
      description: 'A detailed Renaissance bronze medallion commemorating a historical figure, showcasing the artistry of the period.',
      thumbnail: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop',
      source: 'met',
      isThreeD: true,
      metadata: {
        date: '16th century',
        medium: 'Bronze',
        culture: 'Italian Renaissance'
      }
    }
  ];

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
  }

  private getCachedData(key: string): MuseumItem[] | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached)) {
      console.log('🏛️ Museum: Using cached data');
      return cached.data;
    }
    return null;
  }

  private async fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getVisualOfTheWeek(): Promise<MuseumItem[]> {
    const cacheKey = 'visual-of-the-week';
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      console.log('🏛️ Museum: Attempting to fetch from APIs');
      
      // Try Smithsonian first, then fallback to Met, then fallback data
      let items: MuseumItem[] = [];
      
      try {
        items = await this.fetchSmithsonianItems();
        console.log('🏛️ Museum: Successfully fetched from Smithsonian');
      } catch (smithsonianError) {
        console.warn('🏛️ Museum: Smithsonian API unavailable, trying Met Museum');
        try {
          items = await this.fetchMetItems();
          console.log('🏛️ Museum: Successfully fetched from Met Museum');
        } catch (metError) {
          console.warn('🏛️ Museum: Both APIs unavailable, using fallback data');
          items = this.FALLBACK_ITEMS;
        }
      }

      this.setCacheData(cacheKey, items);
      return items;
    } catch (error) {
      console.error('🏛️ Museum: Error fetching visual data:', error);
      return this.FALLBACK_ITEMS;
    }
  }

  private async fetchSmithsonianItems(): Promise<MuseumItem[]> {
    const url = `${this.SMITHSONIAN_BASE_URL}/search?q=online_media_type:"3D Model"&rows=7&api_key=${this.SMITHSONIAN_API_KEY}`;
    
    const response = await this.fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`Smithsonian API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.response?.rows || []).slice(0, 7).map((item: any, index: number) => ({
      id: item.id || `smithsonian-${index}`,
      title: item.title || `Smithsonian Item ${index + 1}`,
      description: item.content?.freetext?.notes?.[0]?.content || 'A fascinating artifact from the Smithsonian collection.',
      thumbnail: item.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.thumbnail || 
                `https://images.unsplash.com/photo-${1578321272176 + index}?w=400&h=300&fit=crop`,
      modelUrl: item.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.content,
      source: 'smithsonian' as const,
      isThreeD: true,
      metadata: {
        date: item.content?.indexedStructured?.date?.[0],
        culture: item.content?.indexedStructured?.culture?.[0]
      }
    }));
  }

  private async fetchMetItems(): Promise<MuseumItem[]> {
    // Get random object IDs first
    const searchUrl = `${this.MET_BASE_URL}/search?hasImages=true&q=*`;
    const searchResponse = await this.fetchWithTimeout(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`Met API search error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const objectIDs = searchData.objectIDs || [];
    
    if (objectIDs.length === 0) {
      throw new Error('No objects found in Met Museum API');
    }

    // Get random selection of 7 objects
    const randomIDs = [];
    for (let i = 0; i < 7 && i < objectIDs.length; i++) {
      const randomIndex = Math.floor(Math.random() * objectIDs.length);
      randomIDs.push(objectIDs[randomIndex]);
    }

    const items: MuseumItem[] = [];
    
    for (const objectID of randomIDs) {
      try {
        const objectUrl = `${this.MET_BASE_URL}/objects/${objectID}`;
        const objectResponse = await this.fetchWithTimeout(objectUrl);
        
        if (objectResponse.ok) {
          const objectData = await objectResponse.json();
          
          items.push({
            id: `met-${objectID}`,
            title: objectData.title || 'Met Museum Artifact',
            description: objectData.artistDisplayName 
              ? `An artwork by ${objectData.artistDisplayName} from the Metropolitan Museum of Art collection.`
              : 'A beautiful artifact from the Metropolitan Museum of Art collection.',
            thumbnail: objectData.primaryImageSmall || 
                      `https://images.unsplash.com/photo-${1578662996442 + items.length}?w=400&h=300&fit=crop`,
            source: 'met' as const,
            isThreeD: false,
            metadata: {
              artist: objectData.artistDisplayName,
              date: objectData.objectDate,
              medium: objectData.medium,
              culture: objectData.culture
            }
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch Met object ${objectID}:`, error);
      }
    }

    if (items.length === 0) {
      throw new Error('No valid Met Museum objects retrieved');
    }

    return items;
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

export const museumService = new MuseumService();
