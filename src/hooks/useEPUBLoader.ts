
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
  const maxRetries = 3;

  useEffect(() => {
    loadEPUB();
    return () => {
      // Cleanup EPUB instance
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

      // Validate EPUB URL
      if (!book.epub_url) {
        throw new Error('No EPUB URL available for this book');
      }

      setLoadingStep('Loading EPUB library...');
      setLoadingProgress(20);
      
      // Dynamic import of epub.js with timeout
      const epubPromise = import('epubjs');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Library loading timed out')), 10000)
      );
      
      const epubModule = await Promise.race([epubPromise, timeoutPromise]) as any;
      const ePub = epubModule.default;
      
      setLoadingStep('Connecting to book server...');
      setLoadingProgress(30);
      
      // Create proxy URL for CORS handling using our Supabase edge function
      const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
      
      console.log('🔗 Using proxy URL:', proxyUrl);
      
      setLoadingStep('Creating EPUB instance...');
      setLoadingProgress(40);
      
      // Test proxy connection first
      await testProxyConnection(proxyUrl);
      
      // Create EPUB book instance
      const epubBook = ePub(proxyUrl);
      epubRef.current = epubBook;

      setLoadingStep('Downloading book content...');
      setLoadingProgress(50);

      // Set up error handler for the book
      epubBook.ready.catch((err: any) => {
        console.error('❌ EPUB ready error:', err);
        throw err;
      });

      // Wait for book to be ready with progressive timeouts
      await waitForBookReady(epubBook);
      console.log('✅ EPUB book ready');

      setLoadingStep('Processing book structure...');
      setLoadingProgress(80);

      // Load navigation/TOC with timeout
      try {
        const navTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Navigation loading timed out')), 5000)
        );
        
        await Promise.race([epubBook.loaded.navigation, navTimeout]);
        setToc(epubBook.navigation.toc || []);
        console.log('📚 TOC loaded:', epubBook.navigation.toc?.length || 0, 'items');
      } catch (navError) {
        console.warn('⚠️ Could not load table of contents:', navError);
        setToc([]);
      }

      setLoadingStep('Finalizing...');
      setLoadingProgress(100);
      
      // Small delay to show completion
      await delay(500);

      setIsLoading(false);
      setLoadingStep('');
      setLoadingProgress(0);
      console.log('✅ EPUB loaded successfully');

    } catch (err) {
      console.error('❌ Error loading EPUB:', err);
      
      // Retry logic
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        console.log(`🔄 Retrying... Attempt ${retryCountRef.current}/${maxRetries}`);
        setLoadingStep(`Retrying... (Attempt ${retryCountRef.current}/${maxRetries})`);
        
        // Exponential backoff
        const backoffDelay = Math.pow(2, retryCountRef.current) * 1000;
        await delay(backoffDelay);
        
        return loadEPUB();
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to load EPUB';
      
      // Provide more specific error messages based on the error
      if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
        setError('The book is taking too long to download. This may be due to the book size or network conditions. Please try again or check your internet connection.');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Could not connect')) {
        setError('Could not connect to the book server. Please check your internet connection and try again.');
      } else if (errorMessage.includes('proxy')) {
        setError('There was an issue with the book loading service. Please try again in a few moments.');
      } else if (errorMessage.includes('CORS')) {
        setError('There was a network configuration issue. Please try again.');
      } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        setError('The book file could not be found. This book may not be available in EPUB format.');
      } else if (errorMessage.includes('502') || errorMessage.includes('504') || errorMessage.includes('service')) {
        setError('The book loading service is temporarily unavailable. Please try again in a few moments.');
      } else if (errorMessage.includes('Access denied') || errorMessage.includes('403')) {
        setError('Access to this book was denied. The book may not be publicly available.');
      } else {
        setError(`Unable to load "${book.title}": ${errorMessage}`);
      }
      
      setIsLoading(false);
      setLoadingStep('');
      setLoadingProgress(0);
    }
  };

  const testProxyConnection = async (proxyUrl: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
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

  const waitForBookReady = async (epubBook: any) => {
    const timeouts = [15000, 25000, 35000]; // Progressive timeouts
    
    for (let i = 0; i < timeouts.length; i++) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Book loading timed out after ${timeouts[i]/1000} seconds`)), timeouts[i])
        );

        await Promise.race([epubBook.ready, timeoutPromise]);
        return; // Success!
        
      } catch (err) {
        if (i === timeouts.length - 1) {
          // Last attempt failed
          throw err;
        }
        
        console.warn(`⚠️ Timeout attempt ${i + 1}, trying longer timeout...`);
        setLoadingStep(`Download taking longer than expected... (${i + 2}/${timeouts.length})`);
      }
    }
  };

  const initializeRendition = (container: HTMLDivElement, fontSize: number) => {
    if (!epubRef.current || !container) return;

    setLoadingStep('Preparing reader...');

    // Create rendition
    const rendition = epubRef.current.renderTo(container, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      spread: 'none'
    });
    renditionRef.current = rendition;

    // Set initial font size
    rendition.themes.fontSize(`${fontSize}px`);

    setLoadingStep('Rendering first page...');

    // Display first page
    rendition.display().then(() => {
      console.log('📄 First page displayed');
      setLoadingStep('');
    }).catch((err: any) => {
      console.error('❌ Rendition display error:', err);
      setLoadingStep('');
    });

    // Track location changes
    rendition.on('relocated', (location: any) => {
      setCurrentLocation(location.start.cfi);
    });

    // Handle rendition errors
    rendition.on('error', (err: any) => {
      console.error('❌ Rendition error:', err);
    });
  };

  const handleRetry = () => {
    retryCountRef.current = 0; // Reset retry count
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
