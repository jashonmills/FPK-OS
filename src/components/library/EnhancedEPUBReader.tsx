
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
import { useStreamingProgressConverter } from '@/hooks/useStreamingProgressConverter';

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

  // Convert progress/error to compatible types for EnhancedLoadingProgress
  const { convertProgress, convertError } = useStreamingProgressConverter();

  // Convert StreamingEPUBProgress to EPUBStreamingProgress
  const convertedProgress = progress ? {
    stage: progress.stage === 'prefetch' ? 'metadata' as const :
           progress.stage === 'downloading' ? 'structure' as const :
           progress.stage === 'processing' ? 'preloading' as const :
           progress.stage as 'streaming' | 'ready',
    percentage: progress.percentage,
    message: progress.message,
    chaptersLoaded: progress.chapterProgress?.loaded,
    totalChapters: progress.totalChapters,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining
  } : null;

  const convertedError = error ? {
    type: error.type as 'network' | 'timeout' | 'parsing' | 'metadata' | 'streaming' | 'unknown',
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
          <EnhancedLoadingProgress
            title={`${book.title} by ${book.author}`}
            progress={convertedProgress}
            error={convertedError}
            onRetry={retryLoad}
            onCancel={onClose}
            type="epub"
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

        {/* Enhanced Table of Contents with streaming */}
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
