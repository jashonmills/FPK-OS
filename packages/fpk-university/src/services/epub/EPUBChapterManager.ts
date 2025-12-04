
import { indexedDBCache } from '../IndexedDBCacheService';
import { EPUBMetadata } from './EPUBStreamingTypes';

export class EPUBChapterManager {
  private epubInstance: any;
  private metadata: EPUBMetadata;
  private chapterQueue = new Map<string, Promise<any>>();
  private preloadedChapters = new Set<string>();
  private currentReadingPosition = 0;
  private readingSpeed = 250; // words per minute (default)
  private preloadDistance = 3; // chapters to preload ahead

  constructor(epubInstance: any, metadata: EPUBMetadata) {
    this.epubInstance = epubInstance;
    this.metadata = metadata;
  }

  async preloadInitialChapters(onProgress?: (loaded: number, total: number) => void): Promise<void> {
    if (!this.metadata || !this.epubInstance) return;

    const chaptersToPreload = Math.min(this.preloadDistance, this.metadata.spine.length);
    const preloadPromises: Promise<void>[] = [];

    for (let i = 0; i < chaptersToPreload; i++) {
      const chapter = this.metadata.spine[i];
      if (chapter) {
        preloadPromises.push(this.preloadChapter(chapter.href, i));
      }
    }

    await Promise.allSettled(preloadPromises);
    
    if (onProgress) {
      onProgress(this.preloadedChapters.size, this.metadata.spine.length);
    }
  }

  private async preloadChapter(href: string, index: number): Promise<void> {
    try {
      const cacheKey = `chapter:${this.metadata?.identifier}:${href}`;
      
      // Check cache first
      const cached = await indexedDBCache.get(cacheKey);
      if (cached) {
        this.preloadedChapters.add(href);
        return;
      }

      // Load chapter content
      const chapterPromise = this.epubInstance.load(href);
      this.chapterQueue.set(href, chapterPromise);
      
      const chapterContent = await chapterPromise;
      
      // Cache chapter content
      await indexedDBCache.set(cacheKey, {
        href,
        content: chapterContent,
        index,
        loadedAt: Date.now()
      }, 'content');

      this.preloadedChapters.add(href);
      console.log(`📄 Preloaded chapter ${index + 1}: ${href}`);

    } catch (error) {
      console.warn(`Failed to preload chapter ${href}:`, error);
    }
  }

  async getChapterContent(href: string): Promise<any> {
    try {
      const cacheKey = `chapter:${this.metadata?.identifier}:${href}`;
      
      // Check cache first
      const cached = await indexedDBCache.get(cacheKey);
      if (cached) {
        console.log('📄 Using cached chapter:', href);
        return cached.content;
      }

      // Check if already loading
      const existingPromise = this.chapterQueue.get(href);
      if (existingPromise) {
        return await existingPromise;
      }

      // Load chapter on demand
      console.log('📄 Loading chapter on demand:', href);
      const chapterPromise = this.epubInstance.load(href);
      this.chapterQueue.set(href, chapterPromise);
      
      const content = await chapterPromise;
      
      // Cache the content
      await indexedDBCache.set(cacheKey, {
        href,
        content,
        loadedAt: Date.now()
      }, 'content');

      return content;

    } catch (error) {
      console.error('Failed to get chapter content:', error);
      throw error;
    }
  }

  async preloadNextChapters(currentChapterIndex: number): Promise<void> {
    if (!this.metadata) return;

    const startIndex = currentChapterIndex + 1;
    const endIndex = Math.min(startIndex + this.preloadDistance, this.metadata.spine.length);

    const preloadPromises: Promise<void>[] = [];

    for (let i = startIndex; i < endIndex; i++) {
      const chapter = this.metadata.spine[i];
      if (chapter && !this.preloadedChapters.has(chapter.href)) {
        preloadPromises.push(this.preloadChapter(chapter.href, i));
      }
    }

    await Promise.allSettled(preloadPromises);
    console.log(`🚀 Preloaded ${preloadPromises.length} upcoming chapters`);
  }

  updateReadingPosition(chapterIndex: number, readingSpeed?: number): void {
    this.currentReadingPosition = chapterIndex;
    
    if (readingSpeed) {
      this.readingSpeed = readingSpeed;
    }

    // Adaptively preload based on reading speed
    const fastReader = this.readingSpeed > 300;
    this.preloadDistance = fastReader ? 5 : 3;

    // Trigger background preloading
    this.preloadNextChapters(chapterIndex);
  }

  getStats() {
    return {
      preloadedChapters: this.preloadedChapters.size,
      queuedChapters: this.chapterQueue.size,
      currentPosition: this.currentReadingPosition,
      readingSpeed: this.readingSpeed,
      preloadDistance: this.preloadDistance
    };
  }

  cleanup(): void {
    this.chapterQueue.clear();
    this.preloadedChapters.clear();
  }
}
