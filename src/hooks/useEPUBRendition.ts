
import { useState, useCallback, useRef, useEffect } from 'react';
import ePub, { Book, Rendition, NavItem } from 'epubjs';

export const useEPUBRendition = (book: Book | null) => {
  const [currentLocation, setCurrentLocation] = useState<string | undefined>();
  const [isNavigating, setIsNavigating] = useState(false);
  const renditionRef = useRef<Rendition | null>(null);

  const initializeRendition = useCallback((container: HTMLDivElement, fontSize: number) => {
    if (!book || !container) return;

    // Clear any existing rendition
    if (renditionRef.current) {
      renditionRef.current.destroy();
    }

    const rendition = book.renderTo(container, {
      width: '100%',
      height: '100%',
      spread: 'none'
    });

    rendition.themes.fontSize(`${fontSize}px`);
    
    rendition.on('locationChanged', (location: any) => {
      setCurrentLocation(location.start.cfi);
      setIsNavigating(false);
    });

    // Fix: Since we passed container to renderTo, call display() with no arguments
    rendition.display();
    renditionRef.current = rendition;

    console.log('📖 EPUB rendition initialized');
  }, [book]);

  const handlePrevPage = useCallback(() => {
    if (!renditionRef.current || isNavigating) return;
    setIsNavigating(true);
    renditionRef.current.prev();
  }, [isNavigating]);

  const handleNextPage = useCallback(() => {
    if (!renditionRef.current || isNavigating) return;
    setIsNavigating(true);
    renditionRef.current.next();
  }, [isNavigating]);

  const handleFontSizeChange = useCallback((newSize: number) => {
    if (!renditionRef.current) return;
    renditionRef.current.themes.fontSize(`${newSize}px`);
    // Force layout refresh after font size change with proper arguments
    setTimeout(() => {
      if (renditionRef.current) {
        // Fix: Use the iframe element directly from the rendition
        try {
          const iframe = renditionRef.current.iframe;
          if (iframe && iframe.parentElement) {
            const container = iframe.parentElement;
            renditionRef.current.resize(container.offsetWidth, container.offsetHeight);
          } else {
            // Fallback: call resize with default dimensions
            renditionRef.current.resize();
          }
        } catch (error) {
          console.warn('Could not resize rendition:', error);
        }
      }
    }, 100);
  }, []);

  const handleTOCItemClick = useCallback((item: NavItem) => {
    if (!renditionRef.current || isNavigating) return;
    setIsNavigating(true);
    // Fix: Pass only href to display() method
    renditionRef.current.display(item.href);
  }, [isNavigating]);

  const forceLayoutRefresh = useCallback(() => {
    if (!renditionRef.current) return;
    setTimeout(() => {
      if (renditionRef.current) {
        // Fix: Use the iframe element directly from the rendition
        try {
          const iframe = renditionRef.current.iframe;
          if (iframe && iframe.parentElement) {
            const container = iframe.parentElement;
            renditionRef.current.resize(container.offsetWidth, container.offsetHeight);
          } else {
            // Fallback: call resize with default dimensions
            renditionRef.current.resize();
          }
        } catch (error) {
          console.warn('Could not resize rendition:', error);
        }
      }
    }, 50);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
        renditionRef.current = null;
      }
    };
  }, []);

  return {
    currentLocation,
    isNavigating,
    initializeRendition,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick,
    forceLayoutRefresh,
    renditionRef,
  };
};
