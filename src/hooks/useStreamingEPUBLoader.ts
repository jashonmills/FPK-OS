
import { useState, useCallback, useRef, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { performanceService } from '@/services/PerformanceOptimizationService';

export interface StreamingEPUBProgress {
  stage: 'prefetch' | 'downloading' | 'processing' | 'streaming' | 'ready';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
  chapterProgress?: {
    loaded: number;
    total: number;
  };
}

export interface StreamingEPUBError {
  type: 'network' | 'timeout' | 'parsing' | 'streaming' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

export const useStreamingEPUBLoader = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<StreamingEPUBProgress | null>(null);
  const [error, setError] = useState<StreamingEPUBError | null>(null);
  const [epubInstance, setEpubInstance] = useState<any>(null);
  const [toc, setToc] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
  const epubModuleRef = useRef<any>(null);
  const streamingQueueRef = useRef<Map<string, Promise<any>>>(new Map());
  
  const MAX_RETRIES = 2;
  const STREAMING_CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  const PREFETCH_CHAPTERS = 3; // Number of chapters to prefetch

  const updateProgress = useCallback((
    stage: StreamingEPUBProgress['stage'],
    percentage: number,
    message: string,
    options?: Partial<StreamingEPUBProgress>
  ) => {
    const elapsed = Date.now() - startTimeRef.current;
    const estimatedTimeRemaining = percentage > 5 && percentage < 95
      ? Math.round(((elapsed / percentage) * (100 - percentage)) / 1000)
      : undefined;

    setProgress({
      stage,
      percentage,
      message,
      estimatedTimeRemaining,
      ...options
    });
  }, []);

  const getOptimalStreamingUrl = useCallback(() => {
    // Check for prefetched book first
    const prefetchedBook = performanceService.getPrefetchedBook(book.id);
    if (prefetchedBook?.optimized_url) {
      console.log('📚 Using prefetched optimized URL');
      return prefetchedBook.optimized_url;
    }

    if (book.storage_url) {
      console.log('📚 Using storage URL for streaming');
      return book.storage_url;
    }
    
    // Use streaming-optimized proxy
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}&stream=true&chunk_size=${STREAMING_CHUNK_SIZE}`;
    console.log('🔗 Using streaming proxy URL');
    return proxyUrl;
  }, [book]);

  const preloadMetadata = useCallback(async () => {
    updateProgress('prefetch', 5, 'Checking for cached metadata...');
    
    try {
      // Try to get metadata from cache first
      const cachedMetadata = performanceService.getPrefetchedBook(book.id);
      if (cachedMetadata) {
        setMetadata(cachedMetadata);
        updateProgress('prefetch', 15, 'Using cached metadata');
        return cachedMetadata;
      }

      // Quick metadata fetch
      updateProgress('prefetch', 10, 'Fetching book metadata...');
      const metadataUrl = `${getOptimalStreamingUrl()}?metadata_only=true`;
      
      const response = await fetch(metadataUrl, {
        signal: abortControllerRef.current?.signal
      });
      
      if (response.ok) {
        const metadata = await response.json();
        setMetadata(metadata);
        updateProgress('prefetch', 15, 'Metadata loaded');
        return metadata;
      }
    } catch (error) {
      console.warn('Metadata prefetch failed, continuing with full load:', error);
    }
    
    return null;
  }, [book, getOptimalStreamingUrl, updateProgress]);

  const createStreamingEPUB = useCallback(async () => {
    updateProgress('downloading', 25, 'Initializing streaming EPUB reader...');
    
    // Load EPUB.js module if not cached
    if (!epubModuleRef.current) {
      updateProgress('processing', 30, 'Loading EPUB engine...');
      epubModuleRef.current = await import('epubjs');
    }
    
    const EPubLib = epubModuleRef.current.default;
    const epubUrl = getOptimalStreamingUrl();
    
    updateProgress('streaming', 40, 'Creating streaming book instance...');
    
    // Create EPUB with streaming configuration
    const streamingOptions = {
      openAs: 'epub',
      requestMethod: 'fetch',
      requestCredentials: 'same-origin',
      requestHeaders: {
        'X-Streaming-Mode': 'true',
        'X-Chunk-Size': STREAMING_CHUNK_SIZE.toString()
      }
    };
    
    const newEpubInstance = EPubLib(epubUrl, streamingOptions);
    
    // Set up streaming progress tracking
    newEpubInstance.ready.then(() => {
      updateProgress('streaming', 60, 'Book structure loaded, preparing chapters...');
    });
    
    return newEpubInstance;
  }, [getOptimalStreamingUrl, updateProgress]);

  const setupChapterStreaming = useCallback(async (epubInstance: any) => {
    try {
      updateProgress('streaming', 70, 'Setting up chapter streaming...');
      
      // Get spine (chapters) information
      await epubInstance.loaded.spine;
      const spine = epubInstance.spine;
      
      if (spine?.spineItems) {
        const totalChapters = spine.spineItems.length;
        updateProgress('streaming', 75, `Found ${totalChapters} chapters, starting prefetch...`, {
          chapterProgress: { loaded: 0, total: totalChapters }
        });
        
        // Prefetch first few chapters for instant reading
        const chaptersToPreload = Math.min(PREFETCH_CHAPTERS, totalChapters);
        
        for (let i = 0; i < chaptersToPreload; i++) {
          const chapter = spine.spineItems[i];
          if (chapter) {
            try {
              // Start prefetching chapter content
              const chapterPromise = epubInstance.load(chapter.href);
              streamingQueueRef.current.set(chapter.href, chapterPromise);
              
              updateProgress('streaming', 75 + (i * 5), `Prefetching chapter ${i + 1}...`, {
                chapterProgress: { loaded: i + 1, total: totalChapters }
              });
            } catch (chapterError) {
              console.warn(`Failed to prefetch chapter ${i + 1}:`, chapterError);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Chapter streaming setup failed, continuing with standard loading:', error);
    }
  }, [updateProgress]);

  const loadEPUBWithStreaming = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(null);
      setEpubInstance(null);
      setToc([]);
      setMetadata(null);
      startTimeRef.current = Date.now();
      
      // Setup abort controller
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      console.log('🚀 Starting streaming EPUB load for:', book.title);
      
      // Step 1: Preload metadata if available
      await preloadMetadata();
      
      // Step 2: Create streaming EPUB instance
      const newEpubInstance = await createStreamingEPUB();
      
      // Step 3: Wait for basic structure
      updateProgress('streaming', 50, 'Loading book structure...');
      
      const timeout = 15000 + (retryCountRef.current * 5000);
      await Promise.race([
        newEpubInstance.ready,
        new Promise((_, reject) => {
          abortControllerRef.current?.signal.addEventListener('abort', () => {
            reject(new Error(`Streaming load timed out after ${timeout / 1000} seconds`));
          });
          setTimeout(() => reject(new Error('Streaming timeout')), timeout);
        })
      ]);
      
      console.log('✅ EPUB streaming instance ready');
      setEpubInstance(newEpubInstance);
      
      // Step 4: Setup chapter streaming in background
      setupChapterStreaming(newEpubInstance);
      
      // Step 5: Load navigation
      updateProgress('streaming', 85, 'Loading navigation...');
      
      try {
        await Promise.race([
          newEpubInstance.loaded.navigation.then(() => {
            const tocItems = newEpubInstance.navigation?.toc || [];
            setToc(tocItems);
            console.log('📚 TOC loaded with streaming:', tocItems.length, 'items');
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Navigation timeout')), 3000)
          )
        ]);
      } catch (navError) {
        console.warn('⚠️ Navigation loading failed, continuing without TOC');
        setToc([]);
      }
      
      updateProgress('ready', 100, 'Book ready with streaming!');
      
      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setIsLoading(false);
      setProgress(null);
      retryCountRef.current = 0;
      
      console.log('✅ Streaming EPUB loading completed successfully');
      
    } catch (err) {
      console.error('❌ Streaming EPUB loading error:', err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      let errorType: StreamingEPUBError['type'] = 'unknown';
      
      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        errorType = 'timeout';
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorType = 'network';
      } else if (errorMessage.includes('stream') || errorMessage.includes('chunk')) {
        errorType = 'streaming';
      } else if (errorMessage.includes('parse') || errorMessage.includes('Parse')) {
        errorType = 'parsing';
      }
      
      const streamingError: StreamingEPUBError = {
        type: errorType,
        message: `Streaming load failed for "${book.title}". ${errorMessage}`,
        recoverable: retryCountRef.current < MAX_RETRIES,
        retryCount: retryCountRef.current
      };
      
      if (streamingError.recoverable) {
        retryCountRef.current++;
        const retryDelay = 1000 + (retryCountRef.current * 1000);
        
        console.log(`🔄 Retrying streaming load... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);
        updateProgress('downloading', 10, `Retrying with enhanced streaming... (${retryCountRef.current}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          loadEPUBWithStreaming();
        }, retryDelay);
        
        return;
      }
      
      setError(streamingError);
      setIsLoading(false);
      setProgress(null);
    }
  }, [book, preloadMetadata, createStreamingEPUB, setupChapterStreaming]);

  const retryLoad = useCallback(() => {
    retryCountRef.current = 0;
    setError(null);
    loadEPUBWithStreaming();
  }, [loadEPUBWithStreaming]);

  const abortLoad = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setProgress(null);
    setError(null);
    streamingQueueRef.current.clear();
  }, []);

  const getChapterContent = useCallback(async (chapterHref: string) => {
    // Check if chapter is already being streamed
    const existingPromise = streamingQueueRef.current.get(chapterHref);
    if (existingPromise) {
      return await existingPromise;
    }
    
    // Load chapter on demand
    if (epubInstance) {
      const chapterPromise = epubInstance.load(chapterHref);
      streamingQueueRef.current.set(chapterHref, chapterPromise);
      return await chapterPromise;
    }
    
    return null;
  }, [epubInstance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortLoad();
      if (epubInstance && typeof epubInstance.destroy === 'function') {
        try {
          epubInstance.destroy();
        } catch (err) {
          console.warn('EPUB cleanup error (non-critical):', err);
        }
      }
    };
  }, [abortLoad, epubInstance]);

  return {
    isLoading,
    progress,
    error,
    epubInstance,
    toc,
    metadata,
    loadEPUB: loadEPUBWithStreaming,
    retryLoad,
    abortLoad,
    getChapterContent
  };
};
