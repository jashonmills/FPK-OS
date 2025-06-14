
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
    toc,
    initializeRendition,
    handleRetry,
    handlePrevPage,
    handleNextPage,
    handleFontSizeChange,
    handleTOCItemClick
  } = useEPUBLoader(book);

  // Initialize rendition when EPUB is loaded and container is ready
  useEffect(() => {
    if (!isLoading && !error && readerRef.current) {
      initializeRendition(readerRef.current, fontSize);
    }
  }, [isLoading, error, initializeRendition, fontSize]);

  const onFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    handleFontSizeChange(newSize);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
        <DialogDescription className="sr-only">
          EPUB reader for {book.title} by {book.author}
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
            />
          </div>

          {/* Navigation Footer */}
          {!isLoading && !error && (
            <EPUBReaderFooter
              onClose={onClose}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          )}
        </div>

        {/* Table of Contents Modal */}
        <EPUBTableOfContents
          isOpen={showTOC}
          onClose={() => setShowTOC(false)}
          toc={toc}
          onItemClick={handleTOCItemClick}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EPUBReader;
