
import React, { useEffect, useRef, useState } from 'react';
import { useEPUBLoader } from '@/hooks/useEPUBLoader';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import EPUBReaderHeader from './EPUBReaderHeader';
import EPUBReaderContent from './EPUBReaderContent';
import EPUBReaderFooter from './EPUBReaderFooter';
import EPUBTableOfContents from './EPUBTableOfContents';

interface EPUBReaderProps {
  book: PublicDomainBook;
  onClose: () => void;
}

const EPUBReader: React.FC<EPUBReaderProps> = ({ book, onClose }) => {
  const readerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);
  const [showTOC, setShowTOC] = useState(false);

  const {
    isLoading,
    error,
    loadingStep,
    loadingProgress,
    isNavigating,
    toc,
    initializeRendition,
    handleRetry,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick,
    forceLayoutRefresh
  } = useEPUBLoader(book);

  // Initialize rendition when EPUB is loaded and container is ready
  useEffect(() => {
    if (!isLoading && !error && readerRef.current) {
      console.log('🎨 Initializing EPUB rendition with container');
      initializeRendition(readerRef.current, fontSize);
    }
  }, [isLoading, error, initializeRendition, fontSize]);

  const onFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    handleFontSizeChange(newSize);
  };

  // Add touch/swipe navigation for mobile
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
      
      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left - next page
          handleNextPage();
        } else {
          // Swipe right - previous page
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

  // Force layout refresh when container size might have changed
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
          EPUB reader for {book.title} by {book.author}. Use arrow keys or swipe to navigate pages.
        </DialogDescription>
        <div className="flex flex-col h-full">
          {/* Header */}
          <EPUBReaderHeader
            title={book.title}
            isLoading={isLoading}
            error={error}
            fontSize={fontSize}
            onClose={onClose}
            onShowTOC={() => setShowTOC(true)}
            onFontSizeChange={onFontSizeChange}
          />

          {/* Reader Content */}
          <div className="flex-1 relative overflow-hidden">
            <EPUBReaderContent
              book={book}
              isLoading={isLoading}
              error={error}
              loadingStep={loadingStep}
              loadingProgress={loadingProgress}
              readerRef={readerRef}
              onRetry={handleRetry}
              onClose={onClose}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              isNavigating={isNavigating}
            />
          </div>

          {/* Navigation Footer */}
          {!isLoading && !error && (
            <EPUBReaderFooter
              onClose={onClose}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              isNavigating={isNavigating}
            />
          )}
        </div>

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

export default EPUBReader;
