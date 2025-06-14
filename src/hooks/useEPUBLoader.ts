
import { useEffect, useRef, useState } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export const useEPUBLoader = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('Initializing...');
  const [currentLocation, setCurrentLocation] = useState('');
  const [toc, setToc] = useState<any[]>([]);
  
  const epubRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);

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

  const loadEPUB = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingStep('Initializing...');

      console.log('📖 Loading EPUB for:', book.title, 'URL:', book.epub_url);

      // Validate EPUB URL
      if (!book.epub_url) {
        throw new Error('No EPUB URL available for this book');
      }

      setLoadingStep('Loading EPUB library...');
      
      // Dynamic import of epub.js
      const ePub = (await import('epubjs')).default;
      
      // Create proxy URL for CORS handling using our Supabase edge function
      const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
      
      console.log('🔗 Using proxy URL:', proxyUrl);
      
      setLoadingStep('Creating EPUB instance...');
      
      // Create EPUB book instance
      const epubBook = ePub(proxyUrl);
      epubRef.current = epubBook;

      setLoadingStep('Downloading book content...');

      // Set up error handler for the book
      epubBook.ready.catch((err: any) => {
        console.error('❌ EPUB ready error:', err);
        throw err;
      });

      // Wait for book to be ready with a longer timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Book loading timed out after 40 seconds')), 40000)
      );

      await Promise.race([epubBook.ready, timeoutPromise]);
      console.log('✅ EPUB book ready');

      setLoadingStep('Loading table of contents...');

      // Load navigation/TOC
      try {
        await epubBook.loaded.navigation;
        setToc(epubBook.navigation.toc || []);
        console.log('📚 TOC loaded:', epubBook.navigation.toc?.length || 0, 'items');
      } catch (navError) {
        console.warn('⚠️ Could not load table of contents:', navError);
        setToc([]);
      }

      setIsLoading(false);
      setLoadingStep('');
      console.log('✅ EPUB loaded successfully');

    } catch (err) {
      console.error('❌ Error loading EPUB:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load EPUB';
      
      // Provide more specific error messages based on the error
      if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
        setError('The book is taking too long to download. This may be due to the book size or network conditions. Please try again.');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Could not connect')) {
        setError('Could not download the book file. Please check your internet connection and try again.');
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
    setError(null);
    setLoadingStep('Retrying...');
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
