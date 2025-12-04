
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

export interface APIConfig {
  timeout: number;
  maxRetries: number;
}
