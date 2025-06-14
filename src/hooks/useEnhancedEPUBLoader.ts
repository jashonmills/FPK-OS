
import { useState, useCallback, useRef } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export interface EPUBLoadingProgress {
  stage: 'connecting' | 'downloading' | 'parsing' | 'rendering' | 'ready';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
}

export interface EPUBLoadError {
  type: 'network' | 'timeout' | 'parsing' | 'rendering' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

export const useEnhancedEPUBLoader = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<EPUBLoadingProgress | null>(null);
  const [error, setError] = useState<EPUBLoadError | null>(null);
  const [epubInstance, setEpubInstance] = useState<any>(null);
  const [toc, setToc] = useState<any[]>([]);
  
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const MAX_RETRIES = 3;
  const BASE_TIMEOUT = 15000; // 15 seconds base timeout
  const MAX_TIMEOUT = 60000; // 1 minute max timeout

  const calculateTimeout = useCallback((bookSize?: number) => {
    if (!bookSize) return BASE_TIMEOUT;
    
    // Estimate timeout based on book size (assuming 1MB/10s on slow connection)
    const estimatedTime = Math.max(BASE_TIMEOUT, (bookSize / 1024 / 1024) * 10000);
    return Math.min(estimatedTime, MAX_TIMEOUT);
  }, []);

  const updateProgress = useCallback((
    stage: EPUBLoadingProgress['stage'],
    percentage: number,
    message: string,
    bytesLoaded?: number,
    totalBytes?: number
  ) => {
    const elapsed = Date.now() - startTimeRef.current;
    const estimatedTimeRemaining = percentage > 0 
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

  const createEnhancedError = useCallback((
    error: any,
    type: EPUBLoadError['type'] = 'unknown'
  ): EPUBLoadError => {
    let message = 'An unexpected error occurred';
    let recoverable = true;

    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      type = 'timeout';
      message = 'The book is taking too long to load. This might be due to the book size or network conditions.';
      recoverable = retryCountRef.current < MAX_RETRIES;
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      type = 'network';
      message = 'Network connection issue. Please check your internet connection.';
      recoverable = true;
    } else if (error.message?.includes('parse') || error.message?.includes('invalid')) {
      type = 'parsing';
      message = 'The book file appears to be corrupted or in an unsupported format.';
      recoverable = false;
    } else if (error.message?.includes('render')) {
      type = 'rendering';
      message = 'Unable to display the book content. The book structure may be complex.';
      recoverable = true;
    }

    return {
      type,
      message,
      recoverable,
      retryCount: retryCountRef.current
    };
  }, []);

  const getEPUBUrl = useCallback(() => {
    // Prioritize storage_url over epub_url
    if (book.storage_url) {
      console.log('📚 Using local storage URL:', book.storage_url.substring(0, 50) + '...');
      return book.storage_url;
    }
    
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
    console.log('🔗 Using proxy URL:', proxyUrl.substring(0, 50) + '...');
    return proxyUrl;
  }, [book.storage_url, book.epub_url]);

  const loadEPUB = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(null);
      startTimeRef.current = Date.now();
      
      abortControllerRef.current = new AbortController();
      
      console.log('📖 Enhanced EPUB loading for:', book.title);
      
      updateProgress('connecting', 5, 'Connecting to book server...');
      
      // Dynamic import of EPUB library
      const epubModule = await import('epubjs');
      const EPubLib = epubModule.default;
      
      updateProgress('connecting', 15, 'Preparing book download...');
      
      const epubUrl = getEPUBUrl();
      const timeout = calculateTimeout();
      
      updateProgress('downloading', 25, 'Downloading book content...');
      
      // Create EPUB instance with timeout
      const newEpubInstance = EPubLib(epubUrl);
      setEpubInstance(newEpubInstance);
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, timeout);
      
      updateProgress('parsing', 50, 'Processing book structure...');
      
      // Wait for book to be ready with proper error handling
      await Promise.race([
        newEpubInstance.ready,
        new Promise((_, reject) => {
          abortControllerRef.current?.signal.addEventListener('abort', () => {
            reject(new Error(`Book loading timed out after ${timeout / 1000} seconds`));
          });
        })
      ]);
      
      clearTimeout(timeoutId);
      
      updateProgress('parsing', 75, 'Loading table of contents...');
      
      // Load navigation with fallback
      try {
        await Promise.race([
          newEpubInstance.loaded.navigation.then(() => {
            setToc(newEpubInstance.navigation.toc || []);
            console.log('📚 TOC loaded:', newEpubInstance.navigation.toc?.length || 0, 'items');
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('TOC timeout')), 8000)
          )
        ]);
      } catch (navError) {
        console.warn('⚠️ Could not load table of contents, continuing without it');
        setToc([]);
      }
      
      updateProgress('ready', 100, 'Book ready to read!');
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      setProgress(null);
      retryCountRef.current = 0;
      
      console.log('✅ Enhanced EPUB loaded successfully');
      
    } catch (err) {
      console.error('❌ Enhanced EPUB loading error:', err);
      
      const enhancedError = createEnhancedError(err);
      
      if (enhancedError.recoverable && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        const retryDelay = Math.pow(2, retryCountRef.current - 1) * 2000; // Exponential backoff
        
        console.log(`🔄 Retrying EPUB load... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);
        updateProgress('connecting', 0, `Retrying... (${retryCountRef.current}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          loadEPUB();
        }, retryDelay);
        
        return;
      }
      
      setError(enhancedError);
      setIsLoading(false);
      setProgress(null);
    }
  }, [book, updateProgress, createEnhancedError, getEPUBUrl, calculateTimeout]);

  const retryLoad = useCallback(() => {
    retryCountRef.current = 0;
    setError(null);
    loadEPUB();
  }, [loadEPUB]);

  const abortLoad = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setProgress(null);
    setError(null);
  }, []);

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
