
import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import BookCarousel from './BookCarousel';
import EnhancedEPUBReader from './EnhancedEPUBReader';
import OpenLibrarySearchBar from './OpenLibrarySearchBar';
import VirtualizedBookList from './VirtualizedBookList';
import GutenbergIngestionTrigger from './GutenbergIngestionTrigger';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { performanceService } from '@/services/PerformanceOptimizationService';

const INITIAL_LOAD_LIMIT = 10; // Increased slightly for better virtualization
const LOAD_MORE_AMOUNT = 20; // Optimized batch size

const PublicDomainBooksSection: React.FC = () => {
  const [loadLimit, setLoadLimit] = useState(INITIAL_LOAD_LIMIT);
  const [selectedBook, setSelectedBook] = useState<PublicDomainBook | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  
  const { books, isLoading, error, refetch, retryCount, hasMore } = usePublicDomainBooks(loadLimit);

  // Initialize performance optimizations
  useEffect(() => {
    const initializePerformance = async () => {
      console.log('🚀 Initializing performance optimizations...');
      
      // Preload critical resources
      await performanceService.preloadCriticalResources();
      
      // Prefetch popular books when we have them
      if (books.length > 0) {
        await performanceService.prefetchPopularBooks(books);
        
        // Prefetch common search terms
        const popularQueries = ['fiction', 'adventure', 'classic', 'science', 'history'];
        await performanceService.prefetchSearchResults(popularQueries);
      }
      
      // Get performance metrics
      setPerformanceMetrics(performanceService.getMetrics());
    };

    if (!isLoading && books.length > 0) {
      initializePerformance();
    }
  }, [books, isLoading]);

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
      {/* Performance Optimization Status */}
      {performanceMetrics && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Performance Optimizations Active</h3>
          </div>
          <div className="text-sm text-green-700 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-medium">Prefetched Books:</span> {performanceMetrics.prefetchedBooksCount}
            </div>
            <div>
              <span className="font-medium">Cached Searches:</span> {performanceMetrics.cachedSearchesCount}
            </div>
            <div>
              <span className="font-medium">CDN Connections:</span> {performanceMetrics.preconnectDomains}
            </div>
            <div>
              <span className="font-medium">Virtualization:</span> Enabled
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Public Domain Collection</h2>
        <p className="text-muted-foreground mb-6">
          Search and add books from OpenLibrary or browse our curated collection with enhanced performance
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
      {books.length < 3 && !isLoading && (
        <div className="mb-8">
          <GutenbergIngestionTrigger />
        </div>
      )}

      {/* Loading indicator for initial load */}
      {isLoading && books.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">
              Loading books with performance optimizations...
            </span>
          </div>
        </div>
      )}

      {/* Virtualized List of All Books - Enhanced Performance */}
      {books.length > 0 && (
        <>
          <div className="bg-background border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">All Books - Virtualized View</h3>
              <p className="text-sm text-muted-foreground">
                Enhanced with virtualization, search caching, and streaming for optimal performance
              </p>
            </div>
            
            <VirtualizedBookList 
              books={books} 
              onBookClick={handleBookClick}
              isLoading={isLoading}
            />
          </div>
          
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
                Showing {books.length} books. Virtualized loading for better performance.
              </p>
            </div>
          )}
        </>
      )}

      {/* Curated Project Gutenberg Collection - Only show if we have books */}
      {curatedBooks.length > 0 && books.length >= INITIAL_LOAD_LIMIT && (
        <BookCarousel
          books={curatedBooks.slice(0, 8)} // Show more with better performance
          sectionId="curatedGutenberg"
          title="Curated Project Gutenberg Collection"
          description={`${curatedBooks.length} carefully selected educational classics`}
          isLoading={false}
          error={null}
        />
      )}

      {/* User-Added Books - Only show if we have books */}
      {userAddedBooks.length > 0 && books.length >= INITIAL_LOAD_LIMIT && (
        <BookCarousel
          books={userAddedBooks.slice(0, 8)} // Show more with better performance
          sectionId="userAddedBooks"
          title="Community Added Books"
          description={`${userAddedBooks.length} books added by users from OpenLibrary`}
          isLoading={false}
          error={null}
        />
      )}

      {/* Enhanced EPUB Reader Modal with Streaming */}
      {selectedBook && (
        <EnhancedEPUBReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </div>
  );
};

export default PublicDomainBooksSection;
