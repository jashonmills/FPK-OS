
import { useState, useRef, useCallback, useEffect } from 'react';
import type ePub from 'epubjs';

export const useEPUBRendition = (epubBookInstance: ePub.Book | null) => {
  const [currentLocation, setCurrentLocation] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const renditionRef = useRef<ePub.Rendition | null>(null);

  const forceLayoutRefresh = useCallback(() => {
    if (renditionRef.current) {
      try {
        // Force the rendition to recalculate layout
        renditionRef.current.resize();
        
        // Wait a bit then trigger another resize to ensure proper layout
        setTimeout(() => {
          if (renditionRef.current) {
            renditionRef.current.resize();
          }
        }, 100);
      } catch (err) {
        console.warn('Layout refresh warning:', err);
      }
    }
  }, []);

  const initializeRendition = useCallback((container: HTMLDivElement, fontSize: number) => {
    if (!epubBookInstance || !container || renditionRef.current) {
      if (renditionRef.current) {
        console.log('🎨 Rendition already initialized. Applying font size.');
        renditionRef.current.themes.fontSize(`${fontSize}px`);
      }
      return;
    }

    console.log('🎨 Initializing rendition...');

    const rendition = epubBookInstance.renderTo(container, {
      width: '100%',
      height: '100%',
      flow: 'paginated',
      spread: 'none',
      minSpreadWidth: 800,
    });
    renditionRef.current = rendition;

    rendition.themes.fontSize(`${fontSize}px`);

    rendition.display().then(() => {
      console.log('📄 First page displayed successfully');
      forceLayoutRefresh();
    }).catch((err: any) => {
      console.error('❌ Rendition display error:', err);
    });

    rendition.on('relocated', (location: any) => {
      setCurrentLocation(location.start.cfi);
      setIsNavigating(false);
      // Force layout refresh after relocation
      setTimeout(() => forceLayoutRefresh(), 50);
    });

    rendition.on('error', (err: any) => {
      console.warn('⚠️ Rendition warning:', err);
    });

    // Add resize event listener for window resize
    const handleResize = () => {
      setTimeout(() => forceLayoutRefresh(), 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renditionRef.current && typeof renditionRef.current.destroy === 'function') {
        try {
          console.log('Destroying rendition from useEPUBRendition cleanup');
          renditionRef.current.destroy();
          renditionRef.current = null;
        } catch (err) {
          console.warn('Rendition cleanup error (non-critical):', err);
        }
      }
    };
  }, [epubBookInstance, forceLayoutRefresh]);

  const handlePrevPage = useCallback(() => {
    if (renditionRef.current && !isNavigating) {
      setIsNavigating(true);
      renditionRef.current.prev();
    }
  }, [isNavigating]);

  const handleNextPage = useCallback(() => {
    if (renditionRef.current && !isNavigating) {
      setIsNavigating(true);
      renditionRef.current.next();
    }
  }, [isNavigating]);

  const handleFontSizeChange = useCallback((newSize: number) => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${newSize}px`);
      // Force layout refresh after font size change
      setTimeout(() => forceLayoutRefresh(), 100);
    }
  }, [forceLayoutRefresh]);

  const handleTOCItemClick = useCallback((href: string) => {
    if (renditionRef.current && !isNavigating) {
      console.log('🔗 Navigating to chapter:', href);
      setIsNavigating(true);
      
      renditionRef.current.display(href).then(() => {
        console.log('✅ Chapter navigation successful');
        // Force multiple layout refreshes to ensure proper formatting
        setTimeout(() => forceLayoutRefresh(), 50);
        setTimeout(() => forceLayoutRefresh(), 200);
        setTimeout(() => forceLayoutRefresh(), 500);
      }).catch((err: any) => {
        console.error('❌ Chapter navigation error:', err);
        setIsNavigating(false);
      });
    }
  }, [isNavigating, forceLayoutRefresh]);
  
  useEffect(() => {
    return () => {
      if (!epubBookInstance && renditionRef.current && typeof renditionRef.current.destroy === 'function') {
          try {
            console.log('Destroying rendition due to epubBookInstance becoming null.');
            renditionRef.current.destroy();
            renditionRef.current = null;
          } catch (err) {
            console.warn('Rendition cleanup error (epubBookInstance null):', err);
          }
      }
    };
  }, [epubBookInstance]);

  return {
    renditionRef,
    currentLocation,
    isNavigating,
    initializeRendition,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick,
    forceLayoutRefresh,
  };
};
