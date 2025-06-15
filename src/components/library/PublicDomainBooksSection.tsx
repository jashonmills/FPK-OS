
import React, { useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import BookCarousel from './BookCarousel';
import EnhancedEPUBReader from './EnhancedEPUBReader';
import OpenLibrarySearchBar from './OpenLibrarySearchBar';
import OptimizedPublicDomainBooksList from './OptimizedPublicDomainBooksList';
import GutenbergIngestionTrigger from './GutenbergIngestionTrigger';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

const INITIAL_LOAD_LIMIT = 10; // Start with fewer books
const LOAD_MORE_AMOUNT = 10;

const PublicDomainBooksSection: React.FC = () => {
  const [loadLimit, setLoadLimit] = useState(INITIAL_LOAD_LIMIT);
  const [selectedBook, setSelectedBook] = useState<PublicDomainBook | null>(null);
  
  const { books, isLoading, error, refetch, retryCount, hasMore } = usePublicDomainBooks(loadLimit);

  const handleBookClick = (book: PublicDomainBook) => {
    setSelectedBook(book);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  const handleLoadMore = () => {
    setLoadLimit(prev => prev + LOAD_MORE_AMOUNT);
  };

  const handleRetry = () => {
    refetch();
  };

  // Transform books into the format expected by BookCarousel
  const carouselBooks = books.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover_url: book.cover_url,
    subjects: book.subjects,
    gutenberg_id: book.gutenberg_id,
    onReadClick: () => handleBookClick(book)
  }));

  // Separate curated and user-added books
  const curatedBooks = carouselBooks.filter((_, index) => !books[index].is_user_added);
  const userAddedBooks = carouselBooks.filter((_, index) => books[index].is_user_added);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Public Domain Collection</h2>
        <p className="text-muted-foreground mb-6">
          Search and add books from OpenLibrary or browse our curated collection
        </p>
        <OpenLibrarySearchBar />
      </div>

      {/* Error handling with retry */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Loading Error</h3>
          </div>
          <p className="text-sm text-destructive mb-3">{error}</p>
          {retryCount > 0 && (
            <p className="text-xs text-muted-foreground mb-3">
              Retry attempt: {retryCount}/3
            </p>
          )}
          <Button onClick={handleRetry} variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Temporary Ingestion Trigger - Remove after books are added */}
      {books.length < 5 && !isLoading && (
        <div className="mb-8">
          <GutenbergIngestionTrigger />
        </div>
      )}

      {/* Loading indicator for initial load */}
      {isLoading && books.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading books... (Starting with {INITIAL_LOAD_LIMIT} books)</span>
          </div>
        </div>
      )}

      {/* Optimized Collapsible List of All Books */}
      {books.length > 0 && (
        <>
          <OptimizedPublicDomainBooksList books={books} isLoading={isLoading} />
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button 
                onClick={handleLoadMore} 
                variant="outline" 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading more books...
                  </>
                ) : (
                  <>
                    Load {LOAD_MORE_AMOUNT} More Books
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Showing {books.length} books. Progressive loading for better performance.
              </p>
            </div>
          )}
        </>
      )}

      {/* Curated Project Gutenberg Collection */}
      {curatedBooks.length > 0 && (
        <BookCarousel
          books={curatedBooks.slice(0, 8)} // Limit carousel items for performance
          sectionId="curatedGutenberg"
          title="Curated Project Gutenberg Collection"
          description={`${curatedBooks.length} carefully selected educational classics`}
          isLoading={false}
          error={null}
        />
      )}

      {/* User-Added Books */}
      {userAddedBooks.length > 0 && (
        <BookCarousel
          books={userAddedBooks.slice(0, 8)} // Limit carousel items for performance
          sectionId="userAddedBooks"
          title="Community Added Books"
          description={`${userAddedBooks.length} books added by users from OpenLibrary`}
          isLoading={false}
          error={null}
        />
      )}

      {/* Show all books together if we don't have the separation */}
      {curatedBooks.length === 0 && userAddedBooks.length === 0 && books.length > 0 && (
        <BookCarousel
          books={carouselBooks.slice(0, 8)} // Limit carousel items for performance
          sectionId="publicDomain"
          title="Available Books"
          description="Educational books from Project Gutenberg and user-added titles"
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Enhanced EPUB Reader Modal */}
      {selectedBook && (
        <EnhancedEPUBReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </div>
  );
};

export default PublicDomainBooksSection;
