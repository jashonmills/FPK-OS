
export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
  hourly: Array<{
    dt: number;
    temp: number;
    pop: number; // Precipitation probability
    weather: Array<{
      main: string;
      description: string;
    }>;
  }>;
  lastUpdated: string;
}

export interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
  expiresAt: number;
}

class WeatherService {
  private readonly API_KEY = 'demo_key'; // User will need to add their own key
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall';
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  private cache = new Map<string, CachedWeatherData>();

  // Fallback data for when API is unavailable or demo key is used
  private readonly FALLBACK_WEATHER: WeatherData = {
    current: {
      temp: 22,
      humidity: 65,
      weather: [{
        main: "Clear",
        description: "clear sky",
        icon: "01d"
      }]
    },
    hourly: Array.from({ length: 12 }, (_, i) => ({
      dt: Date.now() / 1000 + (i * 3600),
      temp: 22 + Math.sin(i * 0.5) * 3,
      pop: Math.max(0, Math.sin(i * 0.3) * 0.4),
      weather: [{
        main: i < 6 ? "Clear" : "Clouds",
        description: i < 6 ? "clear sky" : "scattered clouds"
      }]
    })),
    lastUpdated: new Date().toISOString()
  };

  private getCacheKey(lat: number, lon: number): string {
    return `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  }

  private isCacheValid(cached: CachedWeatherData): boolean {
    return Date.now() < cached.expiresAt;
  }

  private setCacheData(key: string, data: WeatherData): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    });
    
    // Also cache in localStorage
    try {
      localStorage.setItem(`weather_cache_${key}`, JSON.stringify({
        data,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION
      }));
    } catch (error) {
      console.warn('Could not cache weather data in localStorage:', error);
    }
  }

  private getCachedData(key: string): WeatherData | null {
    // Check memory cache first
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached)) {
      console.log('🌤️ Weather: Using memory cached data');
      return cached.data;
    }

    // Check localStorage cache
    try {
      const localCached = localStorage.getItem(`weather_cache_${key}`);
      if (localCached) {
        const parsed = JSON.parse(localCached) as CachedWeatherData;
        if (this.isCacheValid(parsed)) {
          console.log('🌤️ Weather: Using localStorage cached data');
          // Restore to memory cache
          this.cache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Could not read weather cache from localStorage:', error);
    }

    return null;
  }

  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = this.getCacheKey(lat, lon);
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      console.log('🌤️ Weather: Fetching from API');
      
      const url = `${this.BASE_URL}?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&appid=${this.API_KEY}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const weatherData: WeatherData = {
        current: rawData.current,
        hourly: rawData.hourly.slice(0, 12), // Only next 12 hours
        lastUpdated: new Date().toISOString()
      };
      
      this.setCacheData(cacheKey, weatherData);
      console.log('🌤️ Weather: Successfully fetched from API');
      return weatherData;
    } catch (error) {
      console.warn('🌤️ Weather: API unavailable, using fallback data:', error);
      return this.FALLBACK_WEATHER;
    }
  }

  clearCache(): void {
    this.cache.clear();
    // Clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('weather_cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Could not clear weather cache from localStorage:', error);
    }
    console.log('🌤️ Weather: Cache cleared');
  }
}

export const weatherService = new WeatherService();
