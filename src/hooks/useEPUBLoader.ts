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
  const maxRetries = 2;

  useEffect(() => {
    loadEPUB();
    return () => {
      if (epubRef.current) {
        try {
          epubRef.current.destroy();
        } catch (err) {
          console.log('EPUB cleanup error (non-critical):', err);
        }
      }
    };
  }, [book.epub_url, book.storage_url]); // Added book.storage_url dependency

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getEPUBUrl = () => {
    // Priority order: storage_url > epub_url (with proxy) > direct epub_url
    if (book.storage_url) {
      console.log('📚 Using local storage URL:', book.storage_url);
      return book.storage_url;
    }
    
    // Fallback to proxy for external URLs
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
    console.log('🔗 Using proxy URL:', proxyUrl);
    return proxyUrl;
  };

  const loadEPUB = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingStep('Initializing...');
      setLoadingProgress(10);

      console.log('📖 Loading EPUB for:', book.title);

      if (!book.epub_url && !book.storage_url) {
        throw new Error('No EPUB URL available for this book');
      }

      setLoadingStep('Loading EPUB library...');
      setLoadingProgress(20);
      
      // Load EPUB.js library
      const epubModule = await import('epubjs');
      const ePub = epubModule.default;
      
      setLoadingStep('Connecting to book server...');
      setLoadingProgress(30);
      
      const epubUrl = getEPUBUrl();
      
      setLoadingStep('Creating EPUB instance...');
      setLoadingProgress(40);
      
      const epubBook = ePub(epubUrl);
      epubRef.current = epubBook;

      setLoadingStep('Loading book content...');
      setLoadingProgress(50);

      // Wait for book to be ready
      await waitForBookReady(epubBook);
      console.log('✅ EPUB book ready');

      setLoadingStep('Processing book structure...');
      setLoadingProgress(80);

      // Load TOC with timeout
      try {
        await Promise.race([
          epubBook.loaded.navigation.then(() => {
            setToc(epubBook.navigation.toc || []);
            console.log('📚 TOC loaded:', epubBook.navigation.toc?.length || 0, 'items');
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TOC timeout')), 5000)) // Increased TOC timeout
        ]);
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
      
      // Simple retry logic
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        console.log(`🔄 Retrying... Attempt ${retryCountRef.current}/${maxRetries}`);
        setLoadingStep(`Retrying... (${retryCountRef.current}/${maxRetries})`);
        
        await delay(1000);
        return loadEPUB();
      }
      
      handleLoadingError(err);
    }
  };

  const waitForBookReady = async (epubBook: any) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Book parsing timed out. This book may be too large or complex. Please try again.'));
      }, 30000); // Increased timeout to 30 seconds
    });

    await Promise.race([epubBook.ready, timeoutPromise]);
  };

  const handleLoadingError = (err: any) => {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load EPUB';
    
    if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
      setError('This book is taking too long to load, even after extending the wait time. It might be very large or there could be a temporary issue. Please try again later or select a different book.');
    } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      setError('Network connection issue. Please check your internet connection and try again.');
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      setError('This book is not available. Please try selecting a different book.');
    } else {
      setError(`Unable to load "${book.title}". Please try again or select a different book. Details: ${errorMessage}`);
    }
    
    setIsLoading(false);
    setLoadingStep('');
    setLoadingProgress(0);
  };

  const initializeRendition = (container: HTMLDivElement, fontSize: number) => {
    if (!epubRef.current || !container) return;

    console.log('🎨 Initializing rendition...');

    const rendition = epubRef.current.renderTo(container, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      spread: 'none',
      minSpreadWidth: 800
    });
    renditionRef.current = rendition;

    rendition.themes.fontSize(`${fontSize}px`);

    rendition.display().then(() => {
      console.log('📄 First page displayed successfully');
    }).catch((err: any) => {
      console.error('❌ Rendition display error:', err);
    });

    rendition.on('relocated', (location: any) => {
      setCurrentLocation(location.start.cfi);
    });

    rendition.on('error', (err: any) => {
      console.warn('⚠️ Rendition warning:', err);
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
