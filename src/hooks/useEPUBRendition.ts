
import { useState, useRef, useCallback } from 'react';
import type EPub from 'epubjs'; // Import type for ePub and Rendition

export const useEPUBRendition = (epubBookInstance: EPub.Book | null) => {
  const [currentLocation, setCurrentLocation] = useState('');
  const renditionRef = useRef<EPub.Rendition | null>(null);

  const initializeRendition = useCallback((container: HTMLDivElement, fontSize: number) => {
    if (!epubBookInstance || !container || renditionRef.current) {
      // Do not re-initialize if rendition already exists or no book/container
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
    }).catch((err: any) => {
      console.error('❌ Rendition display error:', err);
      // Potentially set an error state here if needed
    });

    rendition.on('relocated', (location: any) => {
      setCurrentLocation(location.start.cfi);
    });

    rendition.on('error', (err: any) => {
      console.warn('⚠️ Rendition warning:', err);
    });
    
    // Cleanup rendition on hook unmount or when epubBookInstance changes
    return () => {
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
  }, [epubBookInstance]); // epubBookInstance is the main dependency

  const handlePrevPage = useCallback(() => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  }, []);

  const handleNextPage = useCallback(() => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  }, []);

  const handleFontSizeChange = useCallback((newSize: number) => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${newSize}px`);
    }
  }, []);

  const handleTOCItemClick = useCallback((href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href);
    }
  }, []);
  
  // Effect to clean up rendition when the hook unmounts or epubBookInstance changes
  useEffect(() => {
    // This effect now primarily serves to re-evaluate initializeRendition if epubBookInstance changes.
    // The actual cleanup is returned by initializeRendition and managed by its useCallback dependencies.
    // However, a direct cleanup if epubBookInstance becomes null might be useful.
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
    renditionRef, // Expose for direct manipulation if needed, though not typical
    currentLocation,
    initializeRendition,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick,
  };
};
