
import { useState, useCallback, useRef, useEffect } from 'react';
import type { Book, Rendition, NavItem } from 'epubjs';

export const useOptimizedEPUBRendition = (book: Book | null) => {
  const [currentLocation, setCurrentLocation] = useState<string | undefined>();
  const [isNavigating, setIsNavigating] = useState(false);
  const renditionRef = useRef<Rendition | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInitializedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (renditionRef.current) {
      try {
        console.log('🧹 Cleaning up EPUB rendition');
        renditionRef.current.destroy();
      } catch (error) {
        console.warn('Rendition cleanup warning (non-critical):', error);
      }
      renditionRef.current = null;
    }
    isInitializedRef.current = false;
    containerRef.current = null;
  }, []);

  const initializeRendition = useCallback((container: HTMLDivElement, fontSize: number) => {
    if (!book || !container || isInitializedRef.current) {
      console.log('⚠️ Skipping rendition init - missing requirements or already initialized');
      return;
    }

    console.log('🎨 Initializing optimized EPUB rendition');
    
    // Cleanup any existing rendition
    cleanup();
    
    // Store container reference
    containerRef.current = container;
    
    try {
      // Create rendition with optimized settings
      const rendition = book.renderTo(container, {
        width: '100%',
        height: '100%',
        spread: 'none',
        allowScriptedContent: false, // Security and performance
        allowPopups: false
      });

      // Configure styling
      rendition.themes.fontSize(`${fontSize}px`);
      rendition.themes.default({
        body: {
          'font-family': 'system-ui, -apple-system, sans-serif !important',
          'line-height': '1.6 !important',
          'margin': '0 !important',
          'padding': '20px !important'
        }
      });

      // Set up event listeners with proper error handling
      rendition.on('locationChanged', (location: any) => {
        try {
          if (location?.start?.cfi) {
            setCurrentLocation(location.start.cfi);
            setIsNavigating(false);
            console.log('📍 Location updated:', location.start.cfi);
          }
        } catch (error) {
          console.warn('Location change error:', error);
          setIsNavigating(false);
        }
      });

      rendition.on('rendered', () => {
        console.log('📄 Page rendered successfully');
        setIsNavigating(false);
      });

      rendition.on('relocated', (location: any) => {
        console.log('🔄 Page relocated');
        setIsNavigating(false);
      });

      // Display the rendition
      rendition.display().then(() => {
        console.log('✅ Rendition displayed successfully');
        isInitializedRef.current = true;
      }).catch((error: any) => {
        console.error('❌ Rendition display error:', error);
        setIsNavigating(false);
      });

      renditionRef.current = rendition;

    } catch (error) {
      console.error('❌ Rendition initialization error:', error);
      setIsNavigating(false);
    }
  }, [book, cleanup]);

  const handlePrevPage = useCallback(() => {
    if (!renditionRef.current || isNavigating || !isInitializedRef.current) return;
    
    setIsNavigating(true);
    console.log('⬅️ Navigating to previous page');
    
    renditionRef.current.prev().catch((error: any) => {
      console.warn('Previous page navigation error:', error);
      setIsNavigating(false);
    });
  }, [isNavigating]);

  const handleNextPage = useCallback(() => {
    if (!renditionRef.current || isNavigating || !isInitializedRef.current) return;
    
    setIsNavigating(true);
    console.log('➡️ Navigating to next page');
    
    renditionRef.current.next().catch((error: any) => {
      console.warn('Next page navigation error:', error);
      setIsNavigating(false);
    });
  }, [isNavigating]);

  const handleFontSizeChange = useCallback((newSize: number) => {
    if (!renditionRef.current || !containerRef.current || !isInitializedRef.current) return;
    
    console.log('🔤 Changing font size to:', newSize);
    
    try {
      renditionRef.current.themes.fontSize(`${newSize}px`);
      
      // Trigger resize after font change
      setTimeout(() => {
        if (renditionRef.current && containerRef.current) {
          const container = containerRef.current;
          renditionRef.current.resize(container.offsetWidth, container.offsetHeight);
        }
      }, 100);
    } catch (error) {
      console.warn('Font size change error:', error);
    }
  }, []);

  const handleTOCItemClick = useCallback((item: NavItem) => {
    if (!renditionRef.current || isNavigating || !isInitializedRef.current) return;
    
    setIsNavigating(true);
    console.log('📖 Navigating to TOC item:', item.label);
    
    renditionRef.current.display(item.href).catch((error: any) => {
      console.warn('TOC navigation error:', error);
      setIsNavigating(false);
    });
  }, [isNavigating]);

  const forceLayoutRefresh = useCallback(() => {
    if (!renditionRef.current || !containerRef.current || !isInitializedRef.current) return;
    
    setTimeout(() => {
      if (renditionRef.current && containerRef.current) {
        try {
          const container = containerRef.current;
          renditionRef.current.resize(container.offsetWidth, container.offsetHeight);
          console.log('🔄 Layout refreshed');
        } catch (error) {
          console.warn('Layout refresh error:', error);
        }
      }
    }, 50);
  }, []);

  // Cleanup on unmount or book change
  useEffect(() => {
    return cleanup;
  }, [cleanup, book]);

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
    isInitialized: isInitializedRef.current
  };
};
