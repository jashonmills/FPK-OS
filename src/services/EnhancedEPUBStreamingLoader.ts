
/**
 * Enhanced EPUB Streaming Loader
 * Implements metadata-first loading and chapter-level streaming
 */

import { EPUBMetadataExtractor } from './epub/EPUBMetadataExtractor';
import { EPUBInstanceCreator } from './epub/EPUBInstanceCreator';
import { EPUBChapterManager } from './epub/EPUBChapterManager';
import {
  EPUBStreamingProgress,
  EPUBStreamingError,
  EPUBMetadata
} from './epub/EPUBStreamingTypes';

class EnhancedEPUBStreamingLoader {
  private abortController: AbortController | null = null;
  private epubInstance: any = null;
  private metadata: EPUBMetadata | null = null;
  private chapterManager: EPUBChapterManager | null = null;

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
      const metadataResult = await EPUBMetadataExtractor.extractMetadata(url, cacheKey);
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
      const epubResult = await EPUBInstanceCreator.createStreamingEPUB(
        url,
        this.abortController,
        (percentage, message) => {
          this.onProgress?.({
            stage: 'structure',
            percentage,
            message
          });
        }
      );

      if (!epubResult.success) {
        return { success: false, error: epubResult.error };
      }

      this.epubInstance = epubResult.epubInstance;
      this.chapterManager = new EPUBChapterManager(this.epubInstance, this.metadata);

      // Step 3: Preload initial chapters
      await this.preloadInitialChapters();

      this.onProgress?.({
        stage: 'ready',
        percentage: 100,
        message: 'EPUB ready with streaming support',
        totalChapters: this.metadata.spine.length,
        chaptersLoaded: this.chapterManager.getStats().preloadedChapters
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

  private async preloadInitialChapters(): Promise<void> {
    if (!this.metadata || !this.chapterManager) return;

    this.onProgress?.({
      stage: 'preloading',
      percentage: 60,
      message: 'Preloading initial chapters...',
      totalChapters: this.metadata.spine.length
    });

    await this.chapterManager.preloadInitialChapters((loaded, total) => {
      this.onProgress?.({
        stage: 'preloading',
        percentage: 85,
        message: `Preloaded ${loaded} chapters`,
        chaptersLoaded: loaded,
        totalChapters: total
      });
    });
  }

  async getChapterContent(href: string): Promise<any> {
    if (!this.chapterManager) {
      throw new Error('Chapter manager not initialized');
    }
    return await this.chapterManager.getChapterContent(href);
  }

  async preloadNextChapters(currentChapterIndex: number): Promise<void> {
    if (this.chapterManager) {
      await this.chapterManager.preloadNextChapters(currentChapterIndex);
    }
  }

  updateReadingPosition(chapterIndex: number, readingSpeed?: number): void {
    if (this.chapterManager) {
      this.chapterManager.updateReadingPosition(chapterIndex, readingSpeed);
    }
  }

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.chapterManager) {
      this.chapterManager.cleanup();
      this.chapterManager = null;
    }

    if (this.epubInstance && typeof this.epubInstance.destroy === 'function') {
      this.epubInstance.destroy();
      this.epubInstance = null;
    }
  }

  getStreamingStats() {
    const chapterStats = this.chapterManager?.getStats() || {
      preloadedChapters: 0,
      queuedChapters: 0,
      currentPosition: 0,
      readingSpeed: 250,
      preloadDistance: 3
    };

    return {
      ...chapterStats,
      metadata: this.metadata
    };
  }
}

export { EnhancedEPUBStreamingLoader };
export type {
  EPUBStreamingProgress,
  EPUBStreamingError,
  EPUBMetadata
} from './epub/EPUBStreamingTypes';
