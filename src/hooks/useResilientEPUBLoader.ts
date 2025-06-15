
import { useState, useCallback, useRef, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export interface ResilientEPUBProgress {
  stage: 'downloading' | 'processing' | 'ready';
  percentage: number;
  message: string;
  currentUrl?: string;
  attemptNumber?: number;
  bytesLoaded?: number;
  totalBytes?: number;
}

export interface ResilientEPUBError {
  type: 'network' | 'timeout' | 'parsing' | 'all_urls_failed';
  message: string;
  recoverable: boolean;
  retryCount: number;
  failedUrls: string[];
  lastAttemptUrl?: string;
}

export const useResilientEPUBLoader = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ResilientEPUBProgress | null>(null);
  const [error, setError] = useState<ResilientEPUBError | null>(null);
  const [epubInstance, setEpubInstance] = useState<any>(null);
  const [toc, setToc] = useState<any[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const epubModuleRef = useRef<any>(null);
  const failedUrlsRef = useRef<string[]>([]);
  const retryCountRef = useRef(0);
  
  const TIMEOUT_DURATION = 15000; // 15 seconds per attempt
  const MAX_RETRIES = 3;

  const updateProgress = useCallback((
    stage: ResilientEPUBProgress['stage'],
    percentage: number,
    message: string,
    currentUrl?: string,
    attemptNumber?: number
  ) => {
    setProgress({
      stage,
      percentage,
      message,
      currentUrl,
      attemptNumber
    });
  }, []);

  const getUrlsToTry = useCallback((): string[] => {
    const urls: string[] = [];
    
    // Primary URL (storage or original)
    if (book.storage_url) {
      urls.push(book.storage_url);
    } else if (book.epub_url) {
      urls.push(book.epub_url);
    }
    
    // Backup URLs for Gutenberg books
    if (book.gutenberg_id) {
      const gutenbergUrls = [
        `https://www.gutenberg.org/ebooks/${book.gutenberg_id}.epub.noimages`,
        `https://www.gutenberg.org/cache/epub/${book.gutenberg_id}/pg${book.gutenberg_id}.epub`,
        `https://www.gutenberg.org/files/${book.gutenberg_id}/${book.gutenberg_id}-0.epub`
      ];
      
      // Add Gutenberg URLs that aren't already in the list
      gutenbergUrls.forEach(url => {
        if (!urls.includes(url)) {
          urls.push(url);
        }
      });
    }
    
    // Proxy URLs as last resort
    if (book.epub_url && !book.storage_url) {
      const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
      urls.push(proxyUrl);
    }
    
    return urls.filter(url => !failedUrlsRef.current.includes(url));
  }, [book]);

  const tryLoadWithUrl = async (url: string, attemptNumber: number): Promise<any> => {
    console.log(`📖 Attempting to load EPUB from: ${url} (Attempt ${attemptNumber})`);
    
    updateProgress('downloading', 20 + (attemptNumber * 10), `Trying source ${attemptNumber}...`, url, attemptNumber);
    
    // Load EPUB.js if not already loaded
    if (!epubModuleRef.current) {
      updateProgress('processing', 30, 'Loading EPUB reader...', url, attemptNumber);
      epubModuleRef.current = await import('epubjs');
    }
    
    const EPubLib = epubModuleRef.current.default;
    
    updateProgress('processing', 50, 'Creating book instance...', url, attemptNumber);
    
    const epubBook = EPubLib(url);
    
    // Set up timeout for this attempt
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout loading from ${url}`));
      }, TIMEOUT_DURATION);
    });
    
    updateProgress('processing', 70, 'Waiting for book to load...', url, attemptNumber);
    
    // Wait for book to be ready
    await Promise.race([epubBook.ready, timeoutPromise]);
    
    updateProgress('processing', 90, 'Loading table of contents...', url, attemptNumber);
    
    // Try to load navigation (non-critical)
    try {
      await Promise.race([
        epubBook.loaded.navigation.then(() => {
          setToc(epubBook.navigation?.toc || []);
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('TOC timeout')), 3000))
      ]);
    } catch (navError) {
      console.warn('⚠️ Could not load TOC, continuing without it');
      setToc([]);
    }
    
    console.log(`✅ Successfully loaded EPUB from: ${url}`);
    return epubBook;
  };

  const loadEPUB = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(null);
      setEpubInstance(null);
      setToc([]);
      failedUrlsRef.current = [];
      retryCountRef.current = 0;
      
      // Clean up any previous abort controller
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      console.log('🚀 Starting resilient EPUB load for:', book.title);
      
      updateProgress('downloading', 10, 'Preparing to load book...');
      
      const urlsToTry = getUrlsToTry();
      
      if (urlsToTry.length === 0) {
        throw new Error('No valid URLs available for this book');
      }
      
      let lastError: Error | null = null;
      
      // Try each URL in sequence
      for (let i = 0; i < urlsToTry.length; i++) {
        const url = urlsToTry[i];
        
        try {
          const epubBook = await tryLoadWithUrl(url, i + 1);
          
          updateProgress('ready', 100, 'Book ready to read!', url);
          
          setEpubInstance(epubBook);
          setIsLoading(false);
          setProgress(null);
          
          return; // Success!
          
        } catch (urlError) {
          console.warn(`❌ Failed to load from ${url}:`, urlError);
          failedUrlsRef.current.push(url);
          lastError = urlError instanceof Error ? urlError : new Error(String(urlError));
          
          // If not the last URL, continue to next
          if (i < urlsToTry.length - 1) {
            updateProgress('downloading', 30 + (i * 20), `Source ${i + 1} failed, trying next...`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between attempts
          }
        }
      }
      
      // All URLs failed
      throw new Error(`All sources failed. Last error: ${lastError?.message || 'Unknown error'}`);
      
    } catch (err) {
      console.error('❌ Resilient EPUB loading failed:', err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      setError({
        type: failedUrlsRef.current.length > 0 ? 'all_urls_failed' : 'network',
        message: `Unable to load "${book.title}". ${errorMessage}`,
        recoverable: true,
        retryCount: retryCountRef.current, // Include retry count
        failedUrls: [...failedUrlsRef.current],
        lastAttemptUrl: failedUrlsRef.current[failedUrlsRef.current.length - 1]
      });
      
      setIsLoading(false);
      setProgress(null);
    }
  }, [book, updateProgress, getUrlsToTry]);

  const retryLoad = useCallback(() => {
    failedUrlsRef.current = []; // Reset failed URLs for retry
    retryCountRef.current++;
    setError(null);
    loadEPUB();
  }, [loadEPUB]);

  const abortLoad = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setProgress(null);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (epubInstance && typeof epubInstance.destroy === 'function') {
        try {
          epubInstance.destroy();
        } catch (err) {
          console.warn('EPUB cleanup error (non-critical):', err);
        }
      }
    };
  }, [epubInstance]);

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
