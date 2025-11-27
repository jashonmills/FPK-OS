
import { MuseumItem, APIConfig } from './types';

export class SmithsonianAPI {
  private readonly API_KEY = 'DEMO_KEY';
  private readonly BASE_URL = 'https://api.si.edu/openaccess/api/v1.0';
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

  private generateDescription(smithsonianData: any): string {
    const notes = smithsonianData.content?.freetext?.notes;
    if (notes && notes.length > 0) {
      return notes[0].content || 'A fascinating artifact from the Smithsonian collection.';
    }
    return 'A remarkable piece from the Smithsonian Institution collection.';
  }

  private validateImageUrl(imageUrl: string | null): boolean {
    if (!imageUrl) return false;
    
    // Check if it's a valid Smithsonian image URL
    const isValidSIImage = imageUrl.includes('si.edu') || 
                          imageUrl.includes('smithsonian');
    
    if (!isValidSIImage) {
      console.warn('🏛️ Smithsonian: Non-museum image URL detected:', imageUrl);
      return false;
    }
    
    return true;
  }

  async fetchItems(): Promise<MuseumItem[]> {
    const url = `${this.BASE_URL}/search?q=online_media_type:"Images"&rows=5&api_key=${this.API_KEY}`;
    
    const response = await this.fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`Smithsonian API error: ${response.status}`);
    }

    const data = await response.json();
    const items: MuseumItem[] = [];
    
    (data.response?.rows || []).forEach((item: any, index: number) => {
      const media = item.content?.descriptiveNonRepeating?.online_media?.media;
      const imageUrl = media?.[0]?.content || media?.[0]?.thumbnail;
      
      if (this.validateImageUrl(imageUrl)) {
        console.log(`🏛️ Smithsonian: Item ${item.id} has valid image:`, imageUrl);
        
        items.push({
          id: item.id || `smithsonian-${index}`,
          title: item.title || 'Smithsonian Artifact',
          description: this.generateDescription(item),
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
        console.warn(`🏛️ Smithsonian: Item ${item.id} missing valid image`);
      }
    });

    console.log(`🏛️ Smithsonian: Retrieved ${items.length} valid items`);
    return items;
  }
}
