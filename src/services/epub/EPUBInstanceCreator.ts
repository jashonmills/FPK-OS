
import { EPUBStreamingError } from './EPUBStreamingTypes';
import { logger } from '@/utils/logger';

export class EPUBInstanceCreator {
  static async createStreamingEPUB(
    url: string, 
    abortController: AbortController,
    onProgress?: (percentage: number, message: string) => void
  ): Promise<{
    success: boolean;
    epubInstance?: any;
    error?: EPUBStreamingError;
  }> {
    try {
      onProgress?.(30, 'Creating streaming EPUB instance...');

      const epubModule = await import('epubjs');
      const EPubLib = epubModule.default;

      // Create EPUB with basic configuration
      const epub = EPubLib(url, {
        openAs: 'epub'
      });

      onProgress?.(60, 'Preparing book for reading...');
      
      // Wait for book to be ready with proper error boundaries
      await Promise.race([
        epub.ready,
        new Promise((_, reject) => {
          abortController.signal.addEventListener('abort', () => {
            reject(new Error(`Book loading timed out`));
          });
        })
      ]);
      
      logger.epub('EPUB instance ready');
      
      onProgress?.(50, 'EPUB structure loaded, preparing streaming...');

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
}
