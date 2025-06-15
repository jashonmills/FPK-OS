
import React from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import EPUBReaderHeader from './EPUBReaderHeader';
import EPUBReaderFooter from './EPUBReaderFooter';
import EPUBTableOfContents from './EPUBTableOfContents';
import EnhancedLoadingProgress from './EnhancedLoadingProgress';
import { useEPUBReaderLogic } from './epub/EPUBReaderContainer';
import { EPUBReaderNavigation } from './epub/EPUBReaderNavigation';
import { EPUBReaderContent } from './epub/EPUBReaderContent';

interface EnhancedEPUBReaderProps {
  book: PublicDomainBook;
  onClose: () => void;
}

const EnhancedEPUBReader: React.FC<EnhancedEPUBReaderProps> = ({ book, onClose }) => {
  const {
    readerRef,
    fontSize,
    showTOC,
    setShowTOC,
    isLoading,
    progress,
    error,
    toc,
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
  } = useEPUBReaderLogic(book);

  // Convert progress to EPUBStreamingProgress format for enhanced UI
  const convertedProgress = progress ? {
    stage: progress.stage === 'downloading' ? 'metadata' as const :
           progress.stage === 'processing' ? 'structure' as const :
           progress.stage === 'ready' ? 'ready' as const : 'streaming' as const,
    percentage: progress.percentage,
    message: progress.message,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining
  } : null;

  // Convert error to EPUBStreamingError format
  const convertedError = error ? {
    type: error.type as 'network' | 'timeout' | 'parsing' | 'metadata' | 'streaming' | 'unknown',
    message: error.message,
    recoverable: error.recoverable,
    retryCount: error.retryCount
  } : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-full max-h-full w-screen h-screen p-0 overflow-hidden [&>button]:hidden"
      >
        <DialogDescription className="sr-only">
          Enhanced EPUB reader for {book.title} by {book.author}. Use arrow keys or swipe to navigate pages.
        </DialogDescription>
        
        {(isLoading || error) ? (
          <EnhancedLoadingProgress
            title={`${book.title} by ${book.author}`}
            progress={convertedProgress}
            error={convertedError}
            onRetry={retryLoad}
            onCancel={onClose}
            type="epub"
          />
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
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

            {/* Single Reader Content - Only the optimized version */}
            <EPUBReaderContent
              readerRef={readerRef}
              isNavigating={isNavigating}
              bookTitle={book.title}
              bookAuthor={book.author}
              forceLayoutRefresh={forceLayoutRefresh}
              isLoading={isLoading}
              error={error}
              isInitialized={isInitialized}
            />

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

        {/* Table of Contents */}
        <EPUBTableOfContents
          isOpen={showTOC}
          onClose={() => setShowTOC(false)}
          toc={toc}
          onItemClick={handleEnhancedTOCItemClick}
          isNavigating={isNavigating}
        />

        {/* Navigation Logic Component */}
        <EPUBReaderNavigation
          isLoading={isLoading}
          error={error}
          isNavigating={isNavigating}
          isInitialized={isInitialized}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onClose={onClose}
          readerRef={readerRef}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEPUBReader;
