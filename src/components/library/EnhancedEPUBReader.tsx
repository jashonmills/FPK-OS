
import React, { useEffect, useRef, useState } from 'react';
import { useEnhancedEPUBLoader } from '@/hooks/useEnhancedEPUBLoader';
import { useEPUBRendition } from '@/hooks/useEPUBRendition';
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
    loadEPUB,
    retryLoad,
    abortLoad
  } = useEnhancedEPUBLoader(book);

  const {
    currentLocation,
    isNavigating,
    initializeRendition,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange: changeFontSize,
    handleTOCItemClick,
    forceLayoutRefresh,
  } = useEPUBRendition(epubInstance);

  const {
    progress: readingProgress,
    isLoading: isProgressLoading,
    startSession,
    endSession,
    updateLocation,
  } = useReadingProgress(book.id);

  // Initialize EPUB loading
  useEffect(() => {
    loadEPUB();
    return () => {
      abortLoad();
    };
  }, [loadEPUB, abortLoad]);

  // Initialize rendition when EPUB is loaded
  useEffect(() => {
    if (!isLoading && !error && epubInstance && readerRef.current) {
      console.log('🎨 Initializing enhanced EPUB rendition');
      initializeRendition(readerRef.current, fontSize);
      
      // Start reading session
      startSession(readingProgress?.current_cfi);
      
      // Restore reading position
      if (readingProgress?.current_cfi) {
        setTimeout(() => {
          // The rendition will handle restoring position
        }, 1000);
      }
    }
  }, [isLoading, error, epubInstance, initializeRendition, fontSize, startSession, readingProgress]);

  const onFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    changeFontSize(newSize);
  };

  // Track location changes for progress saving
  useEffect(() => {
    if (currentLocation && !isNavigating) {
      updateLocation(currentLocation);
    }
  }, [currentLocation, isNavigating, updateLocation]);

  // End session on unmount
  useEffect(() => {
    return () => {
      if (currentLocation) {
        endSession(currentLocation);
      }
    };
  }, [endSession, currentLocation]);

  // Add touch/swipe navigation
  useEffect(() => {
    if (!readerRef.current || isLoading || error || isNavigating) return;

    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;
      
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
  }, [isLoading, error, isNavigating, handlePrevPage, handleNextPage]);

  // Layout refresh
  useEffect(() => {
    if (!isLoading && !error && !isNavigating) {
      const timer = setTimeout(() => {
        forceLayoutRefresh();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, isNavigating, forceLayoutRefresh]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
        <DialogDescription className="sr-only">
          Enhanced EPUB reader for {book.title} by {book.author}. Use arrow keys or swipe to navigate pages.
        </DialogDescription>
        
        {(isLoading || error) ? (
          <UnifiedLoadingProgress
            title={`${book.title} by ${book.author}`}
            progress={progress}
            error={error}
            onRetry={retryLoad}
            onCancel={onClose}
            type="epub"
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
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
                className="w-full h-full"
                tabIndex={0}
                role="main"
                aria-label={`Reading ${book.title} by ${book.author}`}
                style={{ opacity: isNavigating ? 0.7 : 1 }}
              />
              
              {isNavigating && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                  <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-2 shadow-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Loading chapter...</span>
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

        {/* Table of Contents Modal */}
        <EPUBTableOfContents
          isOpen={showTOC}
          onClose={() => setShowTOC(false)}
          toc={toc}
          onItemClick={handleTOCItemClick}
          isNavigating={isNavigating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEPUBReader;
