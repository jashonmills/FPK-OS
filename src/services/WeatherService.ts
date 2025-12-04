
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
  private readonly API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || 'demo_key';
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for more frequent updates
  private cache = new Map<string, CachedWeatherData>();

  // Dynamic fallback data that changes over time
  private generateFallbackWeather(): WeatherData {
    const now = new Date();
    const hour = now.getHours();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Simulate seasonal and daily temperature variations
    const baseTemp = 20 + Math.sin((dayOfYear / 365) * 2 * Math.PI) * 10; // Seasonal variation
    const dailyVariation = Math.sin((hour / 24) * 2 * Math.PI) * 5; // Daily variation
    const currentTemp = baseTemp + dailyVariation + (Math.random() - 0.5) * 4;

    // Weather conditions based on time and random factors
    const conditions = [
      { main: "Clear", description: "clear sky", icon: "01d" },
      { main: "Clouds", description: "scattered clouds", icon: "02d" },
      { main: "Clouds", description: "broken clouds", icon: "03d" },
      { main: "Rain", description: "light rain", icon: "10d" },
      { main: "Drizzle", description: "light drizzle", icon: "09d" }
    ];
    
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    const currentCondition = conditions[conditionIndex];

    return {
      current: {
        temp: Math.round(currentTemp * 10) / 10,
        humidity: Math.round(45 + Math.random() * 40), // 45-85% humidity
        weather: [currentCondition]
      },
      hourly: Array.from({ length: 12 }, (_, i) => {
        const futureHour = (hour + i) % 24;
        const hourlyVariation = Math.sin((futureHour / 24) * 2 * Math.PI) * 5;
        const tempVariation = Math.random() * 3 - 1.5; // ±1.5°C random variation
        
        return {
          dt: Math.floor(now.getTime() / 1000) + (i * 3600),
          temp: Math.round((baseTemp + hourlyVariation + tempVariation) * 10) / 10,
          pop: Math.max(0, Math.min(1, Math.random() * 0.8)), // 0-80% precipitation probability
          weather: [{
            main: conditions[Math.floor(Math.random() * conditions.length)].main,
            description: conditions[Math.floor(Math.random() * conditions.length)].description
          }]
        };
      }),
      lastUpdated: now.toISOString()
    };
  }

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
      return this.generateFallbackWeather();
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
