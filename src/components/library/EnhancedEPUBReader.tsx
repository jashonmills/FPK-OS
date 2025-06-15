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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0">
        <DialogDescription className="sr-only">
          Enhanced streaming EPUB reader for {book.title} by {book.author}. Use arrow keys or swipe to navigate pages.
        </DialogDescription>
        
        {(isLoading || error) ? (
          <EnhancedLoadingProgress
            title={`${book.title} by ${book.author}`}
            progress={progress}
            error={error}
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
