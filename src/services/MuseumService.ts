
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

  // Real museum fallback items with actual museum piece URLs as backup
  private readonly FALLBACK_ITEMS: MuseumItem[] = [
    {
      id: 'fallback-1',
      title: 'Ancient Greek Amphora',
      description: 'A beautifully preserved ancient Greek amphora featuring intricate geometric patterns and mythological scenes.',
      thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/248010/796108/main-image',
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
      thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/248008/796104/main-image',
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
      thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/544697/1080113/main-image',
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
      thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/464206/851002/main-image',
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
      title: 'Chinese Porcelain Vase',
      description: 'An exquisite porcelain vase from the Ming Dynasty, featuring delicate blue and white patterns.',
      thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/39933/395923/main-image',
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
      thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/313595/818006/main-image',
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
      thumbnail: 'https://collectionapi.metmuseum.org/api/collection/v1/iiif/207785/758828/main-image',
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
      console.log('🏛️ Museum: Returning cached visual data, items:', cachedData.length);
      return cachedData;
    }

    console.log('🏛️ Museum: Attempting to fetch from APIs');
    
    try {
      // Try to fetch from both APIs with timeout
      const [metItems, smithsonianItems] = await Promise.allSettled([
        this.fetchMetItems().catch(err => {
          console.warn('🏛️ Museum: Met API failed:', err.message);
          return [];
        }),
        this.fetchSmithsonianItems().catch(err => {
          console.warn('🏛️ Museum: Smithsonian API failed:', err.message);
          return [];
        })
      ]);

      const validMetItems = metItems.status === 'fulfilled' ? metItems.value : [];
      const validSmithsonianItems = smithsonianItems.status === 'fulfilled' ? smithsonianItems.value : [];
      
      const combinedItems = [...validMetItems, ...validSmithsonianItems];
      
      if (combinedItems.length > 0) {
        console.log('🏛️ Museum: Successfully fetched', combinedItems.length, 'items from APIs');
        this.setCacheData(cacheKey, combinedItems);
        return combinedItems;
      } else {
        console.log('🏛️ Museum: No valid items from APIs, using fallback data');
      }
    } catch (error) {
      console.warn('🏛️ Museum: API fetch failed:', error);
    }

    // Use fallback data as last resort
    console.log('🏛️ Museum: Using fallback data with real museum URLs');
    this.setCacheData(cacheKey, this.FALLBACK_ITEMS);
    return this.FALLBACK_ITEMS;
  }

  private async fetchMetItems(): Promise<MuseumItem[]> {
    // Get search results for artwork with images
    const searchUrl = `${this.MET_BASE_URL}/search?hasImages=true&q=ancient OR classical OR sculpture OR pottery&departmentId=11`;
    const searchResponse = await this.fetchWithTimeout(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`Met search API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const objectIDs = searchData.objectIDs || [];
    
    if (objectIDs.length === 0) {
      throw new Error('No objects found in Met Museum search');
    }

    // Get random selection of 5 objects
    const selectedIDs = [];
    for (let i = 0; i < Math.min(5, objectIDs.length); i++) {
      const randomIndex = Math.floor(Math.random() * objectIDs.length);
      selectedIDs.push(objectIDs[randomIndex]);
    }

    const items: MuseumItem[] = [];
    
    for (const objectID of selectedIDs) {
      try {
        const objectUrl = `${this.MET_BASE_URL}/objects/${objectID}`;
        const objectResponse = await this.fetchWithTimeout(objectUrl);
        
        if (objectResponse.ok) {
          const objectData = await objectResponse.json();
          
          // Only include items that have a primary image
          if (objectData.primaryImage || objectData.primaryImageSmall) {
            const imageUrl = objectData.primaryImage || objectData.primaryImageSmall;
            console.log(`🏛️ Museum: Met object ${objectID} has valid image:`, imageUrl);
            
            items.push({
              id: `met-${objectID}`,
              title: objectData.title || 'Untitled Artwork',
              description: this.generateDescription(objectData),
              thumbnail: imageUrl,
              source: 'met' as const,
              isThreeD: false,
              metadata: {
                artist: objectData.artistDisplayName,
                date: objectData.objectDate,
                medium: objectData.medium,
                culture: objectData.culture,
                dimensions: objectData.dimensions
              }
            });
          } else {
            console.warn(`🏛️ Museum: Met object ${objectID} missing primaryImage`);
          }
        }
      } catch (error) {
        console.warn(`🏛️ Museum: Failed to fetch Met object ${objectID}:`, error);
      }
    }

    console.log(`🏛️ Museum: Retrieved ${items.length} valid Met items`);
    return items;
  }

  private async fetchSmithsonianItems(): Promise<MuseumItem[]> {
    const url = `${this.SMITHSONIAN_BASE_URL}/search?q=online_media_type:"Images"&rows=5&api_key=${this.SMITHSONIAN_API_KEY}`;
    
    const response = await this.fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`Smithsonian API error: ${response.status}`);
    }

    const data = await response.json();
    const items: MuseumItem[] = [];
    
    (data.response?.rows || []).forEach((item: any, index: number) => {
      const media = item.content?.descriptiveNonRepeating?.online_media?.media;
      const imageUrl = media?.[0]?.content || media?.[0]?.thumbnail;
      
      if (imageUrl) {
        console.log(`🏛️ Museum: Smithsonian item ${item.id} has valid image:`, imageUrl);
        
        items.push({
          id: item.id || `smithsonian-${index}`,
          title: item.title || 'Smithsonian Artifact',
          description: this.generateSmithsonianDescription(item),
          thumbnail: imageUrl,
          embedUrl: media?.[0]?.content,
          source: 'smithsonian' as const,
          isThreeD: item.content?.descriptiveNonRepeating?.online_media?.mediaType === '3d model',
          metadata: {
            date: item.content?.indexedStructured?.date?.[0],
            culture: item.content?.indexedStructured?.culture?.[0],
            medium: item.content?.indexedStructured?.object_type?.[0]
          }
        });
      } else {
        console.warn(`🏛️ Museum: Smithsonian item ${item.id} missing image`);
      }
    });

    console.log(`🏛️ Museum: Retrieved ${items.length} valid Smithsonian items`);
    return items;
  }

  private generateDescription(metData: any): string {
    const parts = [];
    
    if (metData.objectName) parts.push(metData.objectName);
    if (metData.artistDisplayName) parts.push(`by ${metData.artistDisplayName}`);
    if (metData.culture) parts.push(`from ${metData.culture}`);
    if (metData.period) parts.push(`(${metData.period})`);
    
    const description = parts.length > 0 
      ? parts.join(' ') + ' from the Metropolitan Museum of Art collection.'
      : 'An artwork from the Metropolitan Museum of Art collection.';
    
    return description;
  }

  private generateSmithsonianDescription(smithsonianData: any): string {
    const notes = smithsonianData.content?.freetext?.notes;
    if (notes && notes.length > 0) {
      return notes[0].content || 'A fascinating artifact from the Smithsonian collection.';
    }
    return 'A remarkable piece from the Smithsonian Institution collection.';
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
