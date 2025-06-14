
import { useEffect, useRef, useState } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export const useEPUBLoader = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('');
  const [toc, setToc] = useState<any[]>([]);
  
  const epubRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 2; // Reduced retries
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    loadEPUB();
    return () => {
      // Enhanced cleanup
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (epubRef.current) {
        try {
          epubRef.current.destroy();
        } catch (err) {
          console.log('EPUB cleanup error (non-critical):', err);
        }
      }
    };
  }, [book.epub_url]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loadEPUB = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingStep('Initializing...');
      setLoadingProgress(10);

      console.log('📖 Loading EPUB for:', book.title, 'URL:', book.epub_url);

      if (!book.epub_url) {
        throw new Error('No EPUB URL available for this book');
      }

      setLoadingStep('Loading EPUB library...');
      setLoadingProgress(20);
      
      // Dynamic import with shorter timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Library loading timed out')), 5000)
      );
      
      const epubModule = await Promise.race([import('epubjs'), timeoutPromise]) as any;
      const ePub = epubModule.default;
      
      setLoadingStep('Connecting to book server...');
      setLoadingProgress(30);
      
      const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
      console.log('🔗 Using proxy URL:', proxyUrl);
      
      setLoadingStep('Creating EPUB instance...');
      setLoadingProgress(40);
      
      // Test connection with shorter timeout
      await testProxyConnection(proxyUrl);
      
      const epubBook = ePub(proxyUrl);
      epubRef.current = epubBook;

      setLoadingStep('Downloading book content...');
      setLoadingProgress(50);

      // Enhanced book ready handling with progressive parsing
      await waitForBookReadyOptimized(epubBook);
      console.log('✅ EPUB book ready');

      setLoadingStep('Processing book structure...');
      setLoadingProgress(85);

      // Quick TOC loading with timeout
      try {
        const navPromise = epubBook.loaded.navigation.then(() => {
          setToc(epubBook.navigation.toc || []);
          console.log('📚 TOC loaded:', epubBook.navigation.toc?.length || 0, 'items');
        });
        
        const navTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Navigation timeout')), 3000)
        );
        
        await Promise.race([navPromise, navTimeout]);
      } catch (navError) {
        console.warn('⚠️ Could not load table of contents, continuing without it');
        setToc([]);
      }

      setLoadingStep('Ready to read!');
      setLoadingProgress(100);
      
      await delay(300);

      setIsLoading(false);
      setLoadingStep('');
      setLoadingProgress(0);
      console.log('✅ EPUB loaded successfully');

    } catch (err) {
      console.error('❌ Error loading EPUB:', err);
      
      // Smart retry logic
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        console.log(`🔄 Retrying... Attempt ${retryCountRef.current}/${maxRetries}`);
        setLoadingStep(`Retrying with optimized settings... (${retryCountRef.current}/${maxRetries})`);
        
        const backoffDelay = retryCountRef.current * 1500; // Shorter backoff
        await delay(backoffDelay);
        
        return loadEPUB();
      }
      
      handleLoadingError(err);
    }
  };

  const testProxyConnection = async (proxyUrl: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Shorter timeout
    
    try {
      const response = await fetch(proxyUrl, {
        method: 'HEAD',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Proxy connection failed: ${response.status}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Connection to book server timed out');
      }
      throw err;
    }
  };

  const waitForBookReadyOptimized = async (epubBook: any) => {
    // Set up cleanup function
    let timeoutId: NodeJS.Timeout;
    cleanupRef.current = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    // Progressive timeout strategy with parsing optimization
    const attempts = [
      { timeout: 10000, message: 'Parsing book structure...' },
      { timeout: 15000, message: 'Processing complex formatting...' },
      { timeout: 20000, message: 'Finalizing book preparation...' }
    ];
    
    for (let i = 0; i < attempts.length; i++) {
      try {
        setLoadingStep(attempts[i].message);
        setLoadingProgress(50 + (i * 10)); // Progress from 50% to 80%
        
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Book parsing timed out (attempt ${i + 1})`));
          }, attempts[i].timeout);
        });

        // Wait for book ready with current timeout
        await Promise.race([epubBook.ready, timeoutPromise]);
        
        // Success - clear timeout and return
        clearTimeout(timeoutId);
        return;
        
      } catch (err) {
        clearTimeout(timeoutId);
        
        if (i === attempts.length - 1) {
          // Last attempt failed
          throw new Error('The book file appears to be corrupted or too complex to process. Please try a different book or try again later.');
        }
        
        console.warn(`⚠️ Parsing attempt ${i + 1} failed, trying with longer timeout...`);
      }
    }
  };

  const handleLoadingError = (err: any) => {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load EPUB';
    
    if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
      setError('This book is taking too long to load. It may be a large file or have complex formatting. Please try again or select a different book.');
    } else if (errorMessage.includes('corrupted') || errorMessage.includes('complex')) {
      setError('This book file cannot be processed. Please try selecting a different book from the library.');
    } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      setError('Network connection issue. Please check your internet connection and try again.');
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      setError('This book is not available. Please try selecting a different book.');
    } else {
      setError(`Unable to load "${book.title}". Please try again or select a different book.`);
    }
    
    setIsLoading(false);
    setLoadingStep('');
    setLoadingProgress(0);
  };

  const initializeRendition = (container: HTMLDivElement, fontSize: number) => {
    if (!epubRef.current || !container) return;

    console.log('🎨 Initializing rendition...');

    // Create rendition with optimized settings
    const rendition = epubRef.current.renderTo(container, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      spread: 'none',
      minSpreadWidth: 800 // Optimize for single page on smaller screens
    });
    renditionRef.current = rendition;

    // Set font size
    rendition.themes.fontSize(`${fontSize}px`);

    // Display first page with error handling
    rendition.display().then(() => {
      console.log('📄 First page displayed successfully');
    }).catch((err: any) => {
      console.error('❌ Rendition display error:', err);
      // Continue anyway - some books may have rendering issues but still be readable
    });

    // Track location changes
    rendition.on('relocated', (location: any) => {
      setCurrentLocation(location.start.cfi);
    });

    // Handle rendition errors gracefully
    rendition.on('error', (err: any) => {
      console.warn('⚠️ Rendition warning:', err);
      // Don't fail completely on rendition errors
    });
  };

  const handleRetry = () => {
    retryCountRef.current = 0;
    setError(null);
    setLoadingStep('Retrying...');
    setLoadingProgress(0);
    loadEPUB();
  };

  const handlePrevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  const handleNextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${newSize}px`);
    }
  };

  const handleTOCItemClick = (href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href);
    }
  };

  return {
    isLoading,
    error,
    loadingStep,
    loadingProgress,
    currentLocation,
    toc,
    initializeRendition,
    handleRetry,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick
  };
};
