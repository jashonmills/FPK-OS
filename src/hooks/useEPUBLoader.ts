
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
    initializeRendition: initRendition,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange: changeFontSize,
    handleTOCItemClick,
    // renditionRef, // Not exposed by the main hook
  } = useEPUBRendition(epubBookInstance);

  // The main hook's loading and error state reflect the book loading process.
  // Rendition errors are logged internally by useEPUBRendition but don't typically halt the UI in the same way.
  const isLoading = isBookLoading;
  const error = bookError;

  // Wrapper for initializeRendition to match the old API, if needed, or just use initRendition directly.
  // The old initializeRendition took (container, fontSize). useEPUBRendition's initRendition takes the same.
  const initializeRendition = (container: HTMLDivElement, fontSize: number) => {
    if (epubBookInstance) { // Only initialize if book instance is available
      initRendition(container, fontSize);
    }
  };
  
  // Wrapper for font size change to match old API
  const handleFontSizeChange = (newSize: number) => {
    changeFontSize(newSize);
  };

  // handleRetry now calls the retry mechanism from useEPUBBook
  const handleRetry = () => {
    retryBookLoad();
  };

  // Cleanup effect: useEPUBBook and useEPUBRendition now handle their own internal cleanup.
  // This main hook mostly orchestrates.
  useEffect(() => {
    // console.log('useEPUBLoader: book or epubBookInstance changed');
    // If epubBookInstance becomes null (e.g., book changed, load failed hard),
    // useEPUBRendition's own effect should clean up its rendition.
  }, [book, epubBookInstance]);


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
    handleTOCItemClick,
    // epubRef and renditionRef are no longer exposed as they are internal to the sub-hooks.
  };
};
