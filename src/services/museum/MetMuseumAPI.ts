
import { MuseumItem, APIConfig } from './types';

export class MetMuseumAPI {
  private readonly BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';
  private readonly config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
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

  private validateImageUrl(imageUrl: string | null): boolean {
    if (!imageUrl) return false;
    
    // Check if it's a valid museum image URL
    const isValidMetImage = imageUrl.includes('collectionapi.metmuseum.org') || 
                           imageUrl.includes('metmuseum.org');
    
    if (!isValidMetImage) {
      console.warn('🏛️ Met: Non-museum image URL detected:', imageUrl);
      return false;
    }
    
    return true;
  }

  async fetchItems(): Promise<MuseumItem[]> {
    const searchUrl = `${this.BASE_URL}/search?hasImages=true&q=ancient OR classical OR sculpture OR pottery&departmentId=11`;
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
        const objectUrl = `${this.BASE_URL}/objects/${objectID}`;
        const objectResponse = await this.fetchWithTimeout(objectUrl);
        
        if (objectResponse.ok) {
          const objectData = await objectResponse.json();
          
          // Prioritize primaryImage, fall back to primaryImageSmall
          const imageUrl = objectData.primaryImage || objectData.primaryImageSmall;
          
          if (this.validateImageUrl(imageUrl)) {
            console.log(`🏛️ Met: Object ${objectID} has valid image:`, imageUrl);
            
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
            console.warn(`🏛️ Met: Object ${objectID} missing valid primaryImage`);
          }
        }
      } catch (error) {
        console.warn(`🏛️ Met: Failed to fetch object ${objectID}:`, error);
      }
    }

    console.log(`🏛️ Met: Retrieved ${items.length} valid items`);
    return items;
  }
}
