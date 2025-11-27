
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
        console.log('🧹 Cleaning up SINGLE EPUB rendition - preventing duplicates');
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

    console.log('🎨 Initializing SINGLE optimized EPUB rendition with scroll support');
    
    // Cleanup any existing rendition to prevent duplicates
    cleanup();
    
    // Store container reference
    containerRef.current = container;
    
    try {
      // Create rendition with scroll-friendly configuration
      const rendition = book.renderTo(container, {
        width: '100%',
        height: '100%',
        spread: 'none',
        allowScriptedContent: false,
        flow: 'scrolled-doc', // Enable scrolled document flow
        overflow: 'auto' // Allow content overflow for scrolling
      });

      console.log('✅ SINGLE rendition created - no duplicates');

      // Configure styling for better scrolling experience
      rendition.themes.fontSize(`${fontSize}px`);
      rendition.themes.default({
        body: {
          'font-family': 'system-ui, -apple-system, sans-serif !important',
          'line-height': '1.6 !important',
          'margin': '0 !important',
          'padding': '20px !important',
          'overflow-y': 'auto !important',
          'height': 'auto !important'
        },
        html: {
          'overflow': 'auto !important',
          'height': '100% !important'
        }
      });

      // Set up event listeners with proper error handling
      rendition.on('locationChanged', (location: { start?: { cfi?: string } }) => {
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
        console.log('📄 Page rendered successfully with scroll support');
        setIsNavigating(false);
      });

      rendition.on('relocated', (location: unknown) => {
        console.log('🔄 Page relocated');
        setIsNavigating(false);
      });

      // Display the rendition
      rendition.display().then(() => {
        console.log('✅ SINGLE rendition displayed successfully with scrolling enabled');
        isInitializedRef.current = true;
      }).catch((error: Error) => {
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
    
    renditionRef.current.prev().catch((error: Error) => {
      console.warn('Previous page navigation error:', error);
      setIsNavigating(false);
    });
  }, [isNavigating]);

  const handleNextPage = useCallback(() => {
    if (!renditionRef.current || isNavigating || !isInitializedRef.current) return;
    
    setIsNavigating(true);
    console.log('➡️ Navigating to next page');
    
    renditionRef.current.next().catch((error: Error) => {
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
    
    renditionRef.current.display(item.href).catch((error: Error) => {
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
          console.log('🔄 Layout refreshed with scroll support');
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
