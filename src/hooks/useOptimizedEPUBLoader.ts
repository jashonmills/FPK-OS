
import { useState, useCallback, useRef, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export interface EPUBLoadingProgress {
  stage: 'initializing' | 'connecting' | 'downloading' | 'parsing' | 'ready';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
}

export interface EPUBLoadError {
  type: 'network' | 'timeout' | 'parsing' | 'cors' | 'unknown';
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
  
  const MAX_RETRIES = 2;
  const BASE_TIMEOUT = 20000; // 20 seconds
  const MAX_TIMEOUT = 45000; // 45 seconds max

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
    // Prioritize storage_url (local/cached) over external URLs
    if (book.storage_url) {
      console.log('📚 Using optimized storage URL');
      return book.storage_url;
    }
    
    // Use proxy for external URLs with optimized parameters
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}&optimize=true`;
    console.log('🔗 Using optimized proxy URL');
    return proxyUrl;
  }, [book.storage_url, book.epub_url]);

  const createOptimizedError = useCallback((
    error: any,
    type: EPUBLoadError['type'] = 'unknown'
  ): EPUBLoadError => {
    let message = 'Unable to load this book';
    let recoverable = retryCountRef.current < MAX_RETRIES;

    if (error.message?.includes('timeout') || error.name === 'TimeoutError') {
      type = 'timeout';
      message = 'This book is taking too long to download. It might be large or the connection is slow.';
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      type = 'network';
      message = 'Network connection issue. Please check your internet connection.';
    } else if (error.message?.includes('CORS') || error.message?.includes('cors')) {
      type = 'cors';
      message = 'Unable to access this book due to server restrictions.';
      recoverable = true;
    } else if (error.message?.includes('parse') || error.message?.includes('invalid')) {
      type = 'parsing';
      message = 'This book file appears to be corrupted or incompatible.';
      recoverable = false;
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
      
      console.log('📖 Starting optimized EPUB load for:', book.title);
      
      updateProgress('initializing', 5, 'Preparing to load book...');
      
      // Load EPUB.js module if not already loaded
      if (!epubModuleRef.current) {
        updateProgress('initializing', 15, 'Loading EPUB reader...');
        epubModuleRef.current = await import('epubjs');
      }
      
      const EPubLib = epubModuleRef.current.default;
      
      updateProgress('connecting', 25, 'Connecting to book server...');
      
      const epubUrl = getOptimalEPUBUrl();
      
      updateProgress('downloading', 35, 'Downloading book content...');
      
      // Create EPUB instance with proper error handling
      const newEpubInstance = EPubLib(epubUrl);
      
      // Set up timeout with adaptive timing
      const timeout = Math.min(BASE_TIMEOUT + (retryCountRef.current * 10000), MAX_TIMEOUT);
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, timeout);
      
      updateProgress('parsing', 50, 'Processing book structure...');
      
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
      
      updateProgress('parsing', 75, 'Loading navigation...');
      
      // Set the instance early to prevent race conditions
      setEpubInstance(newEpubInstance);
      
      // Load navigation with timeout and error handling
      try {
        await Promise.race([
          newEpubInstance.loaded.navigation.then(() => {
            const tocItems = newEpubInstance.navigation?.toc || [];
            setToc(tocItems);
            console.log('📚 TOC loaded:', tocItems.length, 'items');
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Navigation timeout')), 5000)
          )
        ]);
      } catch (navError) {
        console.warn('⚠️ Navigation loading failed, continuing without TOC');
        setToc([]);
      }
      
      updateProgress('ready', 100, 'Book ready to read!');
      
      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsLoading(false);
      setProgress(null);
      retryCountRef.current = 0;
      
      console.log('✅ Optimized EPUB loading completed successfully');
      
    } catch (err) {
      console.error('❌ Optimized EPUB loading error:', err);
      
      const optimizedError = createOptimizedError(err);
      
      if (optimizedError.recoverable && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        const retryDelay = 1000 + (retryCountRef.current * 1500); // Progressive delay
        
        console.log(`🔄 Retrying optimized load... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);
        updateProgress('connecting', 10, `Retrying with different settings... (${retryCountRef.current}/${MAX_RETRIES})`);
        
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
    retryCountRef.current = 0;
    setError(null);
    loadEPUB();
  }, [loadEPUB]);

  const abortLoad = useCallback(() => {
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
