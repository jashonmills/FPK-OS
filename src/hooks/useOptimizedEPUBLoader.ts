
import { useState, useCallback, useRef, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export interface EPUBLoadingProgress {
  stage: 'downloading' | 'processing' | 'ready';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
}

export interface EPUBLoadError {
  type: 'network' | 'timeout' | 'parsing' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

export const useOptimizedEPUBLoader = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<EPUBLoadingProgress | null>(null);
  const [error, setError] = useState<EPUBLoadError | null>(null);
  const [epubInstance, setEpubInstance] = useState<any>(null);
  const [toc, setToc] = useState<any[]>([]);
  
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
  const epubModuleRef = useRef<any>(null);
  
  const MAX_RETRIES = 3; // Increased retries
  const BASE_TIMEOUT = 60000; // Increased to 60 seconds
  const MAX_TIMEOUT = 120000; // Increased to 2 minutes max

  const updateProgress = useCallback((
    stage: EPUBLoadingProgress['stage'],
    percentage: number,
    message: string,
    bytesLoaded?: number,
    totalBytes?: number
  ) => {
    const elapsed = Date.now() - startTimeRef.current;
    const estimatedTimeRemaining = percentage > 5 && percentage < 95
      ? Math.round(((elapsed / percentage) * (100 - percentage)) / 1000)
      : undefined;

    setProgress({
      stage,
      percentage,
      message,
      bytesLoaded,
      totalBytes,
      estimatedTimeRemaining
    });
  }, []);

  const getOptimalEPUBUrl = useCallback(() => {
    // Try multiple URL strategies for better success rate
    const urls = [];
    
    // First priority: storage URL if available
    if (book.storage_url) {
      console.log('📚 Using local storage URL');
      urls.push(book.storage_url);
    }
    
    // Second priority: direct Gutenberg URLs if we have the ID
    if (book.gutenberg_id) {
      urls.push(`https://www.gutenberg.org/ebooks/${book.gutenberg_id}.epub.noimages`);
      urls.push(`https://www.gutenberg.org/cache/epub/${book.gutenberg_id}/pg${book.gutenberg_id}.epub`);
    }
    
    // Third priority: proxy URL
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}&timeout=120`;
    urls.push(proxyUrl);
    
    // Return the URL to try based on retry count
    const urlIndex = Math.min(retryCountRef.current, urls.length - 1);
    console.log(`🔗 Trying URL strategy ${urlIndex + 1}/${urls.length}:`, urls[urlIndex].substring(0, 50) + '...');
    return urls[urlIndex];
  }, [book.storage_url, book.epub_url, book.gutenberg_id]);

  const createOptimizedError = useCallback((
    error: any,
    type: EPUBLoadError['type'] = 'unknown'
  ): EPUBLoadError => {
    let message = 'Unable to load this book';
    let recoverable = retryCountRef.current < MAX_RETRIES;

    if (error.message?.includes('timeout') || error.name === 'TimeoutError') {
      type = 'timeout';
      message = `This book is taking longer than expected to download. We're trying different servers to help speed this up.`;
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      type = 'network';
      message = 'Connection issue detected. Trying alternative download methods...';
    } else if (error.message?.includes('parse') || error.message?.includes('invalid')) {
      type = 'parsing';
      message = 'This book file appears to be corrupted. Trying alternative sources...';
      recoverable = true; // Even parsing errors might be recoverable with different URLs
    }

    return { type, message, recoverable, retryCount: retryCountRef.current };
  }, []);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const loadEPUB = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(null);
      setEpubInstance(null);
      setToc([]);
      startTimeRef.current = Date.now();
      
      cleanup();
      abortControllerRef.current = new AbortController();
      
      console.log(`📖 Starting EPUB load attempt ${retryCountRef.current + 1}/${MAX_RETRIES + 1} for:`, book.title);
      
      updateProgress('downloading', 10, 'Initializing download...');
      
      // Load EPUB.js module if not already loaded
      if (!epubModuleRef.current) {
        updateProgress('downloading', 20, 'Loading EPUB reader...');
        epubModuleRef.current = await import('epubjs');
      }
      
      const EPubLib = epubModuleRef.current.default;
      
      updateProgress('downloading', 30, 'Connecting to book server...');
      
      const epubUrl = getOptimalEPUBUrl();
      
      // Progressive timeout based on retry count
      const timeout = Math.min(BASE_TIMEOUT + (retryCountRef.current * 30000), MAX_TIMEOUT);
      console.log(`⏱️ Using timeout: ${timeout / 1000}s for attempt ${retryCountRef.current + 1}`);
      
      updateProgress('downloading', 50, 'Downloading book content...');
      
      // Create EPUB instance with enhanced error handling
      const newEpubInstance = EPubLib(epubUrl);
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        console.log(`⏰ Timeout reached after ${timeout / 1000}s`);
        abortControllerRef.current?.abort();
      }, timeout);
      
      updateProgress('processing', 70, 'Processing book structure...');
      
      // Wait for book to be ready with proper error boundaries
      await Promise.race([
        newEpubInstance.ready,
        new Promise((_, reject) => {
          abortControllerRef.current?.signal.addEventListener('abort', () => {
            reject(new Error(`Book loading timed out after ${timeout / 1000} seconds`));
          });
        })
      ]);
      
      clearTimeout(timeoutId);
      console.log('✅ EPUB instance ready');
      
      // Set the instance early to prevent race conditions
      setEpubInstance(newEpubInstance);
      
      updateProgress('processing', 85, 'Loading table of contents...');
      
      // Load navigation with longer timeout for complex books
      try {
        await Promise.race([
          newEpubInstance.loaded.navigation.then(() => {
            const tocItems = newEpubInstance.navigation?.toc || [];
            setToc(tocItems);
            console.log('📚 TOC loaded:', tocItems.length, 'items');
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Navigation timeout')), 10000)
          )
        ]);
      } catch (navError) {
        console.warn('⚠️ Navigation loading failed, continuing without TOC');
        setToc([]);
      }
      
      updateProgress('ready', 100, 'Book ready to read!');
      
      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      setProgress(null);
      retryCountRef.current = 0;
      
      console.log('✅ EPUB loading completed successfully');
      
    } catch (err) {
      console.error(`❌ EPUB loading error (attempt ${retryCountRef.current + 1}):`, err);
      
      const optimizedError = createOptimizedError(err);
      
      if (optimizedError.recoverable && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        const retryDelay = 2000 + (retryCountRef.current * 2000); // Progressive delay: 2s, 4s, 6s
        
        console.log(`🔄 Retrying with different strategy... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);
        updateProgress('downloading', 5, `Retrying with alternative download method... (${retryCountRef.current}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          loadEPUB();
        }, retryDelay);
        
        return;
      }
      
      setError(optimizedError);
      setIsLoading(false);
      setProgress(null);
    }
  }, [book, updateProgress, createOptimizedError, getOptimalEPUBUrl, cleanup]);

  const retryLoad = useCallback(() => {
    console.log('🔄 Manual retry requested');
    retryCountRef.current = 0;
    setError(null);
    loadEPUB();
  }, [loadEPUB]);

  const abortLoad = useCallback(() => {
    console.log('🛑 Load aborted by user');
    cleanup();
    setIsLoading(false);
    setProgress(null);
    setError(null);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (epubInstance && typeof epubInstance.destroy === 'function') {
        try {
          epubInstance.destroy();
        } catch (err) {
          console.warn('EPUB cleanup error (non-critical):', err);
        }
      }
    };
  }, [cleanup, epubInstance]);

  return {
    isLoading,
    progress,
    error,
    epubInstance,
    toc,
    loadEPUB,
    retryLoad,
    abortLoad
  };
};
