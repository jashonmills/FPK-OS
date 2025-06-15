
import React, { useEffect, useRef, useState } from 'react';
import { useStreamingEPUBLoader } from '@/hooks/useStreamingEPUBLoader';
import { useOptimizedEPUBRendition } from '@/hooks/useOptimizedEPUBRendition';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import EPUBReaderHeader from './EPUBReaderHeader';
import EPUBReaderFooter from './EPUBReaderFooter';
import EPUBTableOfContents from './EPUBTableOfContents';
import UnifiedLoadingProgress from './UnifiedLoadingProgress';

interface EnhancedEPUBReaderProps {
  book: PublicDomainBook;
  onClose: () => void;
}

const EnhancedEPUBReader: React.FC<EnhancedEPUBReaderProps> = ({ book, onClose }) => {
  const readerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  const [showTOC, setShowTOC] = useState(false);

  const {
    isLoading,
    progress,
    error,
    epubInstance,
    toc,
    metadata,
    loadEPUB,
    retryLoad,
    abortLoad,
    getChapterContent
  } = useStreamingEPUBLoader(book);

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

  // Initialize streaming EPUB loading on mount
  useEffect(() => {
    console.log('🚀 Starting streaming EPUB reader for:', book.title);
    loadEPUB();
    
    return () => {
      console.log('🛑 Aborting streaming EPUB load for:', book.title);
      abortLoad();
    };
  }, [loadEPUB, abortLoad, book.title]);

  // Initialize rendition when EPUB is ready
  useEffect(() => {
    if (!isLoading && !error && epubInstance && readerRef.current && !isInitialized) {
      console.log('🎨 Initializing streaming EPUB rendition');
      initializeRendition(readerRef.current, fontSize);
      
      // Start reading session with metadata
      if (readingProgress?.current_cfi) {
        console.log('📖 Starting session with saved position');
        startSession(readingProgress.current_cfi);
      } else {
        console.log('📖 Starting new streaming reading session');
        startSession();
      }
    }
  }, [isLoading, error, epubInstance, initializeRendition, fontSize, isInitialized, startSession, readingProgress]);

  const onFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    changeFontSize(newSize);
  };

  // Enhanced TOC click handler with chapter prefetching
  const handleEnhancedTOCItemClick = async (tocItem: any) => {
    console.log('📖 Loading chapter with streaming:', tocItem.label);
    
    // Prefetch chapter content if available
    if (getChapterContent && tocItem.href) {
      try {
        await getChapterContent(tocItem.href);
        console.log('✅ Chapter content prefetched');
      } catch (chapterError) {
        console.warn('Chapter prefetch failed, loading normally:', chapterError);
      }
    }
    
    // Use the original TOC handler
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
        console.log('💾 Ending streaming reading session');
        endSession(currentLocation);
      }
    };
  }, [endSession, currentLocation]);

  // Add keyboard navigation
  useEffect(() => {
    if (isLoading || error || !isInitialized) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isNavigating) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          handlePrevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          handleNextPage();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, error, isNavigating, handlePrevPage, handleNextPage, onClose, isInitialized]);

  // Add touch/swipe navigation
  useEffect(() => {
    if (!readerRef.current || isLoading || error || !isInitialized) return;

    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY || isNavigating) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handleNextPage();
        } else {
          handlePrevPage();
        }
      }
      
      startX = 0;
      startY = 0;
    };

    const container = readerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isLoading, error, isNavigating, handlePrevPage, handleNextPage, isInitialized]);

  // Layout refresh when needed
  useEffect(() => {
    if (!isLoading && !error && !isNavigating && isInitialized) {
      const timer = setTimeout(() => {
        forceLayoutRefresh();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, isNavigating, forceLayoutRefresh, isInitialized]);

  // Convert streaming progress/error to compatible types for UnifiedLoadingProgress
  const convertedProgress = progress ? {
    stage: progress.stage === 'prefetch' ? 'downloading' as const : 
           progress.stage === 'streaming' ? 'processing' as const :
           progress.stage as 'downloading' | 'processing' | 'ready',
    percentage: progress.percentage,
    message: progress.message,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining
  } : null;

  const convertedError = error ? {
    type: error.type === 'streaming' ? 'network' as const : error.type as 'network' | 'timeout' | 'parsing' | 'unknown',
    message: error.message,
    recoverable: error.recoverable,
    retryCount: error.retryCount
  } : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
        <DialogDescription className="sr-only">
          Enhanced streaming EPUB reader for {book.title} by {book.author}. Use arrow keys or swipe to navigate pages.
        </DialogDescription>
        
        {(isLoading || error) ? (
          <UnifiedLoadingProgress
            title={`${book.title} by ${book.author}`}
            progress={convertedProgress}
            error={convertedError}
            onRetry={retryLoad}
            onCancel={onClose}
            type="epub"
            metadata={metadata}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Header with streaming indicators */}
            <EPUBReaderHeader
              title={book.title}
              isLoading={isLoading || isProgressLoading}
              error={null}
              fontSize={fontSize}
              readingProgress={readingProgress}
              onClose={onClose}
              onShowTOC={() => setShowTOC(true)}
              onFontSizeChange={onFontSizeChange}
            />

            {/* Reader Content */}
            <div className="flex-1 relative overflow-hidden">
              <div
                ref={readerRef}
                className="w-full h-full bg-background"
                tabIndex={0}
                role="main"
                aria-label={`Reading ${book.title} by ${book.author}`}
                style={{ opacity: isNavigating ? 0.7 : 1 }}
              />
              
              {isNavigating && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                  <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-2 shadow-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Loading chapter with streaming...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <EPUBReaderFooter
              onClose={onClose}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              isNavigating={isNavigating}
              readingProgress={readingProgress}
            />
          </div>
        )}

        {/* Enhanced Table of Contents with streaming */}
        <EPUBTableOfContents
          isOpen={showTOC}
          onClose={() => setShowTOC(false)}
          toc={toc}
          onItemClick={handleEnhancedTOCItemClick}
          isNavigating={isNavigating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEPUBReader;
