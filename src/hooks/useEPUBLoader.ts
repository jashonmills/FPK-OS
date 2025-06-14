
import { useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { useEPUBBook } from './useEPUBBook';
import { useEPUBRendition } from './useEPUBRendition';
import { useReadingProgress } from './useReadingProgress';

export const useEPUBLoader = (book: PublicDomainBook) => {
  const {
    epubBookInstance,
    isLoading: isBookLoading,
    error: bookError,
    loadingStep,
    loadingProgress,
    toc,
    retryLoad: retryBookLoad,
  } = useEPUBBook(book);

  const {
    currentLocation,
    isNavigating,
    initializeRendition: initRendition,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange: changeFontSize,
    handleTOCItemClick,
    forceLayoutRefresh,
    renditionRef,
  } = useEPUBRendition(epubBookInstance);

  const {
    progress: readingProgress,
    isLoading: isProgressLoading,
    saveProgress,
    startSession,
    endSession,
    updateLocation,
  } = useReadingProgress(book.id);

  const isLoading = isBookLoading || isProgressLoading;
  const error = bookError;

  const initializeRendition = (container: HTMLDivElement, fontSize: number) => {
    if (epubBookInstance) {
      console.log('📖 Initializing rendition for book:', book.title);
      initRendition(container, fontSize);
      
      // Start reading session when rendition is initialized
      startSession(readingProgress?.current_cfi);
      
      // Restore reading position if available
      if (readingProgress?.current_cfi && renditionRef.current) {
        setTimeout(() => {
          if (renditionRef.current) {
            renditionRef.current.display(readingProgress.current_cfi!);
            console.log('📍 Restored reading position:', readingProgress.current_cfi);
          }
        }, 1000);
      }
    }
  };
  
  const handleFontSizeChange = (newSize: number) => {
    changeFontSize(newSize);
  };

  const handleRetry = () => {
    retryBookLoad();
  };

  // Track location changes for progress saving
  useEffect(() => {
    if (currentLocation && !isNavigating) {
      updateLocation(currentLocation);
    }
  }, [currentLocation, isNavigating, updateLocation]);

  // End session when component unmounts
  useEffect(() => {
    return () => {
      if (currentLocation) {
        endSession(currentLocation);
      }
    };
  }, [endSession, currentLocation]);

  useEffect(() => {
    console.log('📚 EPUB Loader - Book changed:', book.title);
  }, [book, epubBookInstance]);

  return {
    isLoading,
    error,
    loadingStep,
    loadingProgress,
    currentLocation,
    isNavigating,
    toc,
    readingProgress,
    initializeRendition,
    handleRetry,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick,
    forceLayoutRefresh,
  };
};
