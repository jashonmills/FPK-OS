
import { safeLocalStorage } from '@/utils/safeStorage';

export interface Quote {
  content: string;
  author: string;
  id: string;
}

export interface CachedQuote {
  quote: Quote;
  timestamp: number;
  expiresAt: number;
}

class QuoteService {
  private readonly API_BASE_URL = 'https://api.quotable.io';
  private readonly CACHE_KEY = 'quote-of-the-day';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Fallback quotes in case API is unavailable
  private readonly FALLBACK_QUOTES: Quote[] = [
    {
      id: 'fallback-1',
      content: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs'
    },
    {
      id: 'fallback-2',
      content: 'Life is what happens to you while you\'re busy making other plans.',
      author: 'John Lennon'
    },
    {
      id: 'fallback-3',
      content: 'The future belongs to those who believe in the beauty of their dreams.',
      author: 'Eleanor Roosevelt'
    },
    {
      id: 'fallback-4',
      content: 'It is during our darkest moments that we must focus to see the light.',
      author: 'Aristotle'
    },
    {
      id: 'fallback-5',
      content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      author: 'Winston Churchill'
    }
  ];

  private getCachedQuote(): Quote | null {
    try {
      const cached = safeLocalStorage.getItem<string>(this.CACHE_KEY, { fallbackValue: null });
      if (!cached) return null;

      const parsedCache: CachedQuote = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() < parsedCache.expiresAt) {
        return parsedCache.quote;
      }

      safeLocalStorage.removeItem(this.CACHE_KEY);
      return null;
    } catch (error) {
      safeLocalStorage.removeItem(this.CACHE_KEY);
      return null;
    }
  }

  private setCachedQuote(quote: Quote): void {
    try {
      const now = Date.now();
      const cacheData: CachedQuote = {
        quote,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION
      };

      safeLocalStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      // Silently handle cache errors
    }
  }

  private getRandomFallbackQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * this.FALLBACK_QUOTES.length);
    return this.FALLBACK_QUOTES[randomIndex];
  }

  private async fetchWithTimeout(url: string, timeout = 8000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
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

  async getQuoteOfTheDay(): Promise<Quote> {
    // Check cache first
    const cachedQuote = this.getCachedQuote();
    if (cachedQuote) {
      return cachedQuote;
    }

    // Try to fetch from API
    try {
      const response = await this.fetchWithTimeout(`${this.API_BASE_URL}/random`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const quote: Quote = {
        id: data._id || `api-${Date.now()}`,
        content: data.content || 'No content available',
        author: data.author || 'Unknown'
      };

      this.setCachedQuote(quote);
      return quote;

    } catch (error) {
      // Use fallback quote
      const fallbackQuote = this.getRandomFallbackQuote();
      
      // Cache fallback for shorter duration (1 hour) so we retry API sooner
      const shortCacheData: CachedQuote = {
        quote: fallbackQuote,
        timestamp: Date.now(),
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
      };
      
      safeLocalStorage.setItem(this.CACHE_KEY, JSON.stringify(shortCacheData));
      return fallbackQuote;
    }
  }

  clearCache(): void {
    safeLocalStorage.removeItem(this.CACHE_KEY);
  }

  isNewDay(): boolean {
    const cached = this.getCachedQuote();
    if (!cached) return true;

    const today = new Date().toDateString();
    const cachedDate = new Date(Date.now() - this.CACHE_DURATION).toDateString();
    
    return today !== cachedDate;
  }
}

export const quoteService = new QuoteService();
