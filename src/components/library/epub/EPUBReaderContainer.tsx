
import React, { useEffect, useRef, useState } from 'react';
import { useOptimizedEPUBLoader } from '@/hooks/useOptimizedEPUBLoader';
import { useOptimizedEPUBRendition } from '@/hooks/useOptimizedEPUBRendition';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { PublicDomainBook } from '@/types/publicDomainBooks';

interface EPUBReaderContainerProps {
  book: PublicDomainBook;
  onClose: () => void;
}

export const useEPUBReaderLogic = (book: PublicDomainBook) => {
  const readerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  const [showTOC, setShowTOC] = useState(false);

  // Use the working optimized loader instead of broken streaming
  const {
    isLoading,
    progress,
    error,
    epubInstance,
    toc,
    loadEPUB,
    retryLoad,
    abortLoad
  } = useOptimizedEPUBLoader(book);

  const {
    currentLocation,
    isNavigating,
    initializeRendition,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange: changeFontSize,
    handleTOCItemClick,
    forceLayoutRefresh,
    isInitialized
  } = useOptimizedEPUBRendition(epubInstance);

  const {
    progress: readingProgress,
    isLoading: isProgressLoading,
    startSession,
    endSession,
    updateLocation,
  } = useReadingProgress(book.id);

  // Initialize EPUB loading on mount
  useEffect(() => {
    console.log('🚀 Starting optimized EPUB reader for:', book.title);
    loadEPUB();
    
    return () => {
      console.log('🛑 Aborting EPUB load for:', book.title);
      abortLoad();
    };
  }, [loadEPUB, abortLoad, book.title]);

  // Initialize rendition when EPUB is ready
  useEffect(() => {
    if (!isLoading && !error && epubInstance && readerRef.current && !isInitialized) {
      console.log('🎨 Initializing EPUB rendition');
      initializeRendition(readerRef.current, fontSize);
      
      // Start reading session with saved position
      if (readingProgress?.current_cfi) {
        console.log('📖 Starting session with saved position');
        startSession(readingProgress.current_cfi);
      } else {
        console.log('📖 Starting new reading session');
        startSession();
      }
    }
  }, [isLoading, error, epubInstance, initializeRendition, fontSize, isInitialized, startSession, readingProgress]);

  const onFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    changeFontSize(newSize);
  };

  // Simplified TOC click handler
  const handleEnhancedTOCItemClick = (tocItem: any) => {
    console.log('📖 Loading chapter:', tocItem.label);
    handleTOCItemClick(tocItem);
    setShowTOC(false);
  };

  // Track location changes for progress saving
  useEffect(() => {
    if (currentLocation && !isNavigating && isInitialized) {
      updateLocation(currentLocation);
    }
  }, [currentLocation, isNavigating, updateLocation, isInitialized]);

  // End session on unmount
  useEffect(() => {
    return () => {
      if (currentLocation) {
        console.log('💾 Ending reading session');
        endSession(currentLocation);
      }
    };
  }, [endSession, currentLocation]);

  return {
    readerRef,
    fontSize,
    showTOC,
    setShowTOC,
    isLoading,
    progress,
    error,
    epubInstance,
    toc,
    currentLocation,
    isNavigating,
    readingProgress,
    isProgressLoading,
    isInitialized,
    onFontSizeChange,
    handlePrevPage,
    handleNextPage,
    handleEnhancedTOCItemClick,
    retryLoad,
    forceLayoutRefresh
  };
};
