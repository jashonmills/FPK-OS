
import { useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { useEPUBBook } from './useEPUBBook';
import { useEPUBRendition } from './useEPUBRendition';

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
  } = useEPUBRendition(epubBookInstance);

  const isLoading = isBookLoading;
  const error = bookError;

  const initializeRendition = (container: HTMLDivElement, fontSize: number) => {
    if (epubBookInstance) {
      console.log('📖 Initializing rendition for book:', book.title);
      initRendition(container, fontSize);
    }
  };
  
  const handleFontSizeChange = (newSize: number) => {
    changeFontSize(newSize);
  };

  const handleRetry = () => {
    retryBookLoad();
  };

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
    initializeRendition,
    handleRetry,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick,
    forceLayoutRefresh,
  };
};
