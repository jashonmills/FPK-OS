
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
  
  const MAX_RETRIES = 4; // Increased retries for better reliability
  const BASE_TIMEOUT = 45000; // Base 45 seconds
  const MAX_TIMEOUT = 120000; // Max 2 minutes

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
    const urls = [];
    
    // PRIORITY 1: Storage URL (fastest and most reliable)
    if (book.storage_url && book.download_status === 'completed') {
      console.log('📚 Using optimized storage URL');
      urls.push(book.storage_url);
    }
    
    // PRIORITY 2: Direct Gutenberg URLs
    if (book.gutenberg_id) {
      urls.push(`https://www.gutenberg.org/ebooks/${book.gutenberg_id}.epub.noimages`);
      urls.push(`https://www.gutenberg.org/cache/epub/${book.gutenberg_id}/pg${book.gutenberg_id}.epub`);
      urls.push(`https://www.gutenberg.org/files/${book.gutenberg_id}/${book.gutenberg_id}-0.epub`);
    }
    
    // PRIORITY 3: Backup URLs if available
    if (book.backup_urls?.length) {
      urls.push(...book.backup_urls);
    }
    
    // PRIORITY 4: Original EPUB URL
    urls.push(book.epub_url);
    
    // PRIORITY 5: Proxy URL as last resort
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}&timeout=120`;
    urls.push(proxyUrl);
    
    // Return the URL to try based on retry count
    const urlIndex = Math.min(retryCountRef.current, urls.length - 1);
    const selectedUrl = urls[urlIndex];
    
    console.log(`🔗 URL Strategy ${urlIndex + 1}/${urls.length}:`, 
      selectedUrl.includes('storage') ? 'Storage (Fast)' :
      selectedUrl.includes('gutenberg.org') ? 'Direct Gutenberg' :
      selectedUrl.includes('proxy') ? 'Proxy Fallback' : 'Standard');
    
    return selectedUrl;
  }, [book.storage_url, book.download_status, book.epub_url, book.gutenberg_id, book.backup_urls]);

  const createOptimizedError = useCallback((
    error: any,
    type: EPUBLoadError['type'] = 'unknown'
  ): EPUBLoadError => {
    let message = 'Unable to load this book';
    let recoverable = retryCountRef.current < MAX_RETRIES;

    if (error.message?.includes('timeout') || error.name === 'TimeoutError') {
      type = 'timeout';
      message = book.storage_url 
        ? `Book is taking longer than expected to download. Trying alternative servers...`
        : `Large book detected. Using faster download methods...`;
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      type = 'network';
      message = book.storage_url 
        ? 'Storage temporarily unavailable. Trying Project Gutenberg directly...'
        : 'Connection issue detected. Trying alternative download methods...';
    } else if (error.message?.includes('parse') || error.message?.includes('invalid')) {
      type = 'parsing';
      message = 'Book file appears corrupted. Trying alternative sources...';
      recoverable = true;
    }

    return { type, message, recoverable, retryCount: retryCountRef.current };
  }, [book.storage_url]);

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
      
      console.log(`📖 Starting optimized EPUB load attempt ${retryCountRef.current + 1}/${MAX_RETRIES + 1} for:`, book.title);
      
      updateProgress('downloading', 10, 'Initializing optimized reader...');
      
      // Load EPUB.js module if not already loaded
      if (!epubModuleRef.current) {
        updateProgress('downloading', 20, 'Loading EPUB engine...');
        epubModuleRef.current = await import('epubjs');
      }
      
      const EPubLib = epubModuleRef.current.default;
      
      const epubUrl = getOptimalEPUBUrl();
      const isStorageUrl = epubUrl.includes('storage');
      const isProxyUrl = epubUrl.includes('proxy');
      
      updateProgress('downloading', 30, 
        isStorageUrl ? 'Connecting to optimized storage...' :
        isProxyUrl ? 'Using enhanced proxy server...' :
        'Connecting to Project Gutenberg...'
      );
      
      // Progressive timeout based on source and retry count
      const timeout = isStorageUrl ? 30000 : // Storage should be fast
                     isProxyUrl ? MAX_TIMEOUT : // Proxy gets max time
                     Math.min(BASE_TIMEOUT + (retryCountRef.current * 15000), MAX_TIMEOUT);
      
      console.log(`⏱️ Using ${timeout / 1000}s timeout for ${isStorageUrl ? 'storage' : isProxyUrl ? 'proxy' : 'direct'} download`);
      
      updateProgress('downloading', 50, 
        isStorageUrl ? 'Loading from optimized storage...' :
        'Downloading book content...'
      );
      
      // Create EPUB instance with enhanced error handling
      const newEpubInstance = EPubLib(epubUrl);
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        console.log(`⏰ Timeout reached after ${timeout / 1000}s`);
        abortControllerRef.current?.abort();
      }, timeout);
      
      updateProgress('processing', 70, 'Processing book structure...');
      
      // Wait for book to be ready
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
      
      setEpubInstance(newEpubInstance);
      
      updateProgress('processing', 85, 'Loading navigation...');
      
      // Load navigation with extended timeout for complex books
      try {
        await Promise.race([
          newEpubInstance.loaded.navigation.then(() => {
            const tocItems = newEpubInstance.navigation?.toc || [];
            setToc(tocItems);
            console.log('📚 Navigation loaded:', tocItems.length, 'items');
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Navigation timeout')), 15000)
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
      
      console.log('✅ Optimized EPUB loading completed successfully');
      
    } catch (err) {
      console.error(`❌ EPUB loading error (attempt ${retryCountRef.current + 1}):`, err);
      
      const optimizedError = createOptimizedError(err);
      
      if (optimizedError.recoverable && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        const retryDelay = 1500 + (retryCountRef.current * 1500); // Progressive delay
        
        console.log(`🔄 Retrying with next strategy... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);
        updateProgress('downloading', 5, 
          `Trying alternative download method... (${retryCountRef.current}/${MAX_RETRIES})`
        );
        
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
