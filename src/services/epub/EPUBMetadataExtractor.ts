
import { indexedDBCache } from '../IndexedDBCacheService';
import { performanceService } from '../PerformanceOptimizationService';
import { EPUBMetadata, EPUBStreamingError } from './EPUBStreamingTypes';

export class EPUBMetadataExtractor {
  static async extractMetadata(url: string, cacheKey: string): Promise<{
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

      // Load EPUB.js
      const epubModule = await import('epubjs');
      const EPubLib = epubModule.default;

      // Create temporary EPUB instance for metadata extraction
      const tempEpub = EPubLib(url);
      
      // Extract metadata with timeout
      const metadataPromise = this.extractFromEpub(tempEpub);
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

  private static async extractFromEpub(epub: any): Promise<EPUBMetadata> {
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

  private static isMetadataFresh(metadata: EPUBMetadata): boolean {
    const age = Date.now() - metadata.loadedAt;
    return age < 24 * 60 * 60 * 1000; // 24 hours
  }
}
