/**
 * Enhanced EPUB Streaming Loader
 * Implements metadata-first loading and chapter-level streaming
 */

import { indexedDBCache } from './IndexedDBCacheService';
import { performanceService } from './PerformanceOptimizationService';

export interface EPUBStreamingProgress {
  stage: 'metadata' | 'structure' | 'preloading' | 'streaming' | 'ready';
  percentage: number;
  message: string;
  chaptersLoaded?: number;
  totalChapters?: number;
  bytesLoaded?: number;
  totalBytes?: number;
  readingSpeed?: number;
}

export interface EPUBStreamingError {
  type: 'network' | 'timeout' | 'parsing' | 'metadata' | 'streaming' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
  context?: string;
}

export interface EPUBMetadata {
  title: string;
  author: string;
  identifier: string;
  language: string;
  description?: string;
  subjects?: string[];
  rights?: string;
  publisher?: string;
  coverHref?: string;
  toc: any[];
  spine: any[];
  resources: { [key: string]: any };
  loadedAt: number;
}

class EnhancedEPUBStreamingLoader {
  private abortController: AbortController | null = null;
  private epubInstance: any = null;
  private metadata: EPUBMetadata | null = null;
  private chapterQueue = new Map<string, Promise<any>>();
  private preloadedChapters = new Set<string>();
  private currentReadingPosition = 0;
  private readingSpeed = 250; // words per minute (default)
  private preloadDistance = 3; // chapters to preload ahead

  constructor(
    private onProgress?: (progress: EPUBStreamingProgress) => void,
    private onError?: (error: EPUBStreamingError) => void
  ) {}

  async loadEPUB(url: string, cacheKey: string): Promise<{
    success: boolean;
    epubInstance?: any;
    metadata?: EPUBMetadata;
    error?: EPUBStreamingError;
  }> {
    try {
      this.abortController = new AbortController();
      
      this.onProgress?.({
        stage: 'metadata',
        percentage: 5,
        message: 'Loading EPUB metadata...'
      });

      // Step 1: Load metadata first
      const metadataResult = await this.loadMetadata(url, cacheKey);
      if (!metadataResult.success) {
        return { success: false, error: metadataResult.error };
      }

      this.metadata = metadataResult.metadata!;

      this.onProgress?.({
        stage: 'structure',
        percentage: 25,
        message: 'Creating EPUB structure...',
        totalChapters: this.metadata.spine.length
      });

      // Step 2: Create EPUB instance with streaming configuration
      const epubResult = await this.createStreamingEPUB(url);
      if (!epubResult.success) {
        return { success: false, error: epubResult.error };
      }

      this.epubInstance = epubResult.epubInstance;

      // Step 3: Preload initial chapters
      await this.preloadInitialChapters();

      this.onProgress?.({
        stage: 'ready',
        percentage: 100,
        message: 'EPUB ready with streaming support',
        totalChapters: this.metadata.spine.length,
        chaptersLoaded: this.preloadedChapters.size
      });

      console.log('✅ EPUB loaded with enhanced streaming');
      return { 
        success: true, 
        epubInstance: this.epubInstance,
        metadata: this.metadata 
      };

    } catch (error) {
      const streamingError: EPUBStreamingError = {
        type: 'unknown',
        message: error instanceof Error ? error.message : 'Unknown streaming error',
        recoverable: true,
        retryCount: 0,
        context: 'main_load'
      };

      this.onError?.(streamingError);
      return { success: false, error: streamingError };
    }
  }

  private async loadMetadata(url: string, cacheKey: string): Promise<{
    success: boolean;
    metadata?: EPUBMetadata;
    error?: EPUBStreamingError;
  }> {
    try {
      // Check cache first
      const cachedMetadata = await indexedDBCache.get(`epub-meta:${cacheKey}`);
      if (cachedMetadata && this.isMetadataFresh(cachedMetadata)) {
        console.log('📚 Using cached EPUB metadata:', cacheKey);
        return { success: true, metadata: cachedMetadata };
      }

      // Try prefetched metadata from performance service
      const prefetchedBook = await performanceService.getPrefetchedBook(cacheKey);
      if (prefetchedBook?.metadata) {
        console.log('🚀 Using prefetched EPUB metadata:', cacheKey);
        return { success: true, metadata: prefetchedBook.metadata };
      }

      this.onProgress?.({
        stage: 'metadata',
        percentage: 10,
        message: 'Fetching EPUB metadata...'
      });

      // Load EPUB.js
      const epubModule = await import('epubjs');
      const EPubLib = epubModule.default;

      // Create temporary EPUB instance for metadata extraction
      const tempEpub = EPubLib(url);
      
      // Extract metadata with timeout
      const metadataPromise = this.extractMetadata(tempEpub);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Metadata extraction timeout')), 10000);
      });

      const metadata = await Promise.race([metadataPromise, timeoutPromise]) as EPUBMetadata;

      // Cache metadata
      await indexedDBCache.set(`epub-meta:${cacheKey}`, metadata, 'metadata');

      // Cleanup temporary instance
      if (tempEpub && typeof tempEpub.destroy === 'function') {
        tempEpub.destroy();
      }

      return { success: true, metadata };

    } catch (error) {
      console.error('❌ EPUB metadata loading failed:', error);
      
      const metadataError: EPUBStreamingError = {
        type: 'metadata',
        message: `Failed to load EPUB metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recoverable: true,
        retryCount: 0,
        context: 'metadata_extraction'
      };

      return { success: false, error: metadataError };
    }
  }

  private async extractMetadata(epub: any): Promise<EPUBMetadata> {
    await epub.ready;
    
    // Wait for all metadata to load
    await Promise.all([
      epub.loaded.metadata,
      epub.loaded.navigation,
      epub.loaded.spine,
      epub.loaded.resources
    ]);

    const metadata: EPUBMetadata = {
      title: epub.metadata.title || 'Unknown Title',
      author: epub.metadata.creator || 'Unknown Author',
      identifier: epub.metadata.identifier || '',
      language: epub.metadata.language || 'en',
      description: epub.metadata.description,
      subjects: epub.metadata.subject ? [epub.metadata.subject] : [],
      rights: epub.metadata.rights,
      publisher: epub.metadata.publisher,
      coverHref: epub.cover,
      toc: epub.navigation.toc || [],
      spine: epub.spine.spineItems || [],
      resources: epub.resources || {},
      loadedAt: Date.now()
    };

    console.log('📖 EPUB metadata extracted:', {
      title: metadata.title,
      chapters: metadata.spine.length,
      tocItems: metadata.toc.length
    });

    return metadata;
  }

  private async createStreamingEPUB(url: string): Promise<{
    success: boolean;
    epubInstance?: any;
    error?: EPUBStreamingError;
  }> {
    try {
      this.onProgress?.({
        stage: 'structure',
        percentage: 30,
        message: 'Creating streaming EPUB instance...'
      });

      const epubModule = await import('epubjs');
      const EPubLib = epubModule.default;

      // Create EPUB with basic configuration
      const epub = EPubLib(url, {
        openAs: 'epub'
      });

      // Set up custom headers if needed
      if (epub.archive && epub.archive.request) {
        epub.archive.request.setHeaders({
          'X-Streaming-Mode': 'true',
          'X-Metadata-Only': 'false'
        });
      }
      
      updateProgress('processing', 75, 'Preparing book for reading...');
      
      // Wait for book to be ready with proper error boundaries
      await Promise.race([
        epub.ready,
        new Promise((_, reject) => {
          this.abortController?.signal.addEventListener('abort', () => {
            reject(new Error(`Book loading timed out`));
          });
        })
      ]);
      
      console.log('✅ EPUB instance ready');
      
      this.onProgress?.({
        stage: 'structure',
        percentage: 50,
        message: 'EPUB structure loaded, preparing streaming...'
      });

      return { success: true, epubInstance: epub };

    } catch (error) {
      const structureError: EPUBStreamingError = {
        type: 'streaming',
        message: `Failed to create streaming EPUB: ${error instanceof Error ? error.message : 'Unknown error'}`,
        recoverable: true,
        retryCount: 0,
        context: 'epub_creation'
      };

      return { success: false, error: structureError };
    }
  }

  private async preloadInitialChapters(): Promise<void> {
    if (!this.metadata || !this.epubInstance) return;

    this.onProgress?.({
      stage: 'preloading',
      percentage: 60,
      message: 'Preloading initial chapters...',
      totalChapters: this.metadata.spine.length
    });

    const chaptersToPreload = Math.min(this.preloadDistance, this.metadata.spine.length);
    const preloadPromises: Promise<void>[] = [];

    for (let i = 0; i < chaptersToPreload; i++) {
      const chapter = this.metadata.spine[i];
      if (chapter) {
        preloadPromises.push(this.preloadChapter(chapter.href, i));
      }
    }

    await Promise.allSettled(preloadPromises);

    this.onProgress?.({
      stage: 'preloading',
      percentage: 85,
      message: `Preloaded ${this.preloadedChapters.size} chapters`,
      chaptersLoaded: this.preloadedChapters.size,
      totalChapters: this.metadata.spine.length
    });
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

  private isMetadataFresh(metadata: EPUBMetadata): boolean {
    const age = Date.now() - metadata.loadedAt;
    return age < 24 * 60 * 60 * 1000; // 24 hours
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.chapterQueue.clear();
    this.preloadedChapters.clear();

    if (this.epubInstance && typeof this.epubInstance.destroy === 'function') {
      this.epubInstance.destroy();
      this.epubInstance = null;
    }
  }

  getStreamingStats() {
    return {
      preloadedChapters: this.preloadedChapters.size,
      queuedChapters: this.chapterQueue.size,
      currentPosition: this.currentReadingPosition,
      readingSpeed: this.readingSpeed,
      preloadDistance: this.preloadDistance,
      metadata: this.metadata
    };
  }
}

export { EnhancedEPUBStreamingLoader };
