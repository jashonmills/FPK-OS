
import React, { useState, useEffect } from 'react';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import BookCarousel from './BookCarousel';
import EPUBReader from './EPUBReader';
import VirtualizedBookList from './VirtualizedBookList';
import GutenbergIngestionTrigger from './GutenbergIngestionTrigger';
import PerformanceMetricsDashboard from './PerformanceMetricsDashboard';
import LoadingIndicator from './LoadingIndicator';
import ErrorHandler from './ErrorHandler';
import LoadMoreSection from './LoadMoreSection';
import LibraryHeader from './LibraryHeader';
import { performanceService } from '@/services/PerformanceOptimizationService';
import { browsingPatternsAnalyzer } from '@/services/BrowsingPatternsAnalyzer';

// Remove artificial limits - show all available books
const INITIAL_LOAD_LIMIT = 100; // Increased to show all books
const LOAD_MORE_AMOUNT = 50;

const PublicDomainBooksSection: React.FC = () => {
  const [loadLimit, setLoadLimit] = useState(INITIAL_LOAD_LIMIT);
  const [selectedBook, setSelectedBook] = useState<PublicDomainBook | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [browsingAnalytics, setBrowsingAnalytics] = useState<any>(null);
  const [prefetchSuggestions, setPrefetchSuggestions] = useState<PublicDomainBook[]>([]);
  
  // Load all books without artificial limits
  const { books, isLoading, error, refetch, retryCount, hasMore } = usePublicDomainBooks();

  // Initialize performance optimizations and browsing analysis
  useEffect(() => {
    const initializeOptimizations = async () => {
      console.log('🚀 Initializing Phase 4 optimizations...');
      
      try {
        // Preload critical resources
        await performanceService.preloadCriticalResources();
        
        // Prefetch popular books when we have them
        if (books.length > 0) {
          await performanceService.prefetchPopularBooks(books);
          
          // Get intelligent prefetch suggestions
          const suggestions = await browsingPatternsAnalyzer.getPrefetchSuggestions(books);
          setPrefetchSuggestions(suggestions);
        }
        
        // Get performance metrics
        const metrics = await performanceService.getMetrics();
        setPerformanceMetrics(metrics);
        
        // Get browsing analytics
        const analytics = browsingPatternsAnalyzer.getAnalytics();
        setBrowsingAnalytics(analytics);
      } catch (error) {
        console.warn('⚠️ Performance optimization failed:', error);
        // Continue without performance optimizations
      }
    };

    if (!isLoading && books.length > 0) {
      initializeOptimizations();
    }
  }, [books, isLoading]);

  // Update analytics periodically
  useEffect(() => {
    const updateAnalytics = () => {
      try {
        const analytics = browsingPatternsAnalyzer.getAnalytics();
        setBrowsingAnalytics(analytics);
      } catch (error) {
        console.warn('⚠️ Analytics update failed:', error);
      }
    };

    const interval = setInterval(updateAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBookClick = (book: PublicDomainBook) => {
    // Record book click for pattern analysis
    try {
      browsingPatternsAnalyzer.recordEvent(book.id, 'click', {
        title: book.title,
        author: book.author,
        subjects: book.subjects
      });
    } catch (error) {
      console.warn('⚠️ Analytics recording failed:', error);
    }
    
    setSelectedBook(book);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  const handleLoadMore = () => {
    setLoadLimit(prev => prev + LOAD_MORE_AMOUNT);
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

  console.log(`📚 Displaying ${books.length} books total (${curatedBooks.length} curated, ${userAddedBooks.length} user-added)`);

  return (
    <div className="space-y-8">
      {/* Phase 4 Performance & Analytics Dashboard */}
      {performanceMetrics && (
        <PerformanceMetricsDashboard
          performanceMetrics={performanceMetrics}
          browsingAnalytics={browsingAnalytics}
          prefetchSuggestions={prefetchSuggestions}
        />
      )}

      {/* Search Bar */}
      <LibraryHeader />

      {/* Error handling with retry */}
      {error && (
        <ErrorHandler
          error={error}
          retryCount={retryCount}
          onRetry={refetch}
        />
      )}

      {/* Temporary Ingestion Trigger - Remove after books are added */}
      {books.length < 10 && !isLoading && (
        <div className="mb-8">
          <GutenbergIngestionTrigger />
        </div>
      )}

      {/* Loading indicator for initial load */}
      {isLoading && books.length === 0 && (
        <LoadingIndicator />
      )}

      {/* Enhanced Virtualized List with Instant Search - Show all books */}
      {books.length > 0 && (
        <>
          <div className="bg-background border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">All Books - Enhanced Search & UX</h3>
              <p className="text-sm text-muted-foreground">
                Showing {books.length} available books with instant search and intelligent browsing patterns
              </p>
            </div>
            
            <VirtualizedBookList 
              books={books} 
              onBookClick={handleBookClick}
              isLoading={isLoading}
            />
          </div>
        </>
      )}

      {/* Intelligent Prefetch Suggestions */}
      {prefetchSuggestions.length > 0 && books.length >= 10 && (
        <BookCarousel
          books={prefetchSuggestions.slice(0, 8).map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover_url: book.cover_url,
            subjects: book.subjects,
            gutenberg_id: book.gutenberg_id,
            onReadClick: () => handleBookClick(book)
          }))}
          sectionId="smartSuggestions"
          title="Smart Suggestions"
          description={`${prefetchSuggestions.length} books recommended based on your browsing patterns`}
          isLoading={false}
          error={null}
        />
      )}

      {/* Curated Project Gutenberg Collection - Only show if we have books */}
      {curatedBooks.length > 0 && books.length >= 10 && (
        <BookCarousel
          books={curatedBooks.slice(0, 12)}
          sectionId="curatedGutenberg"
          title="Curated Project Gutenberg Collection"
          description={`${curatedBooks.length} carefully selected educational classics`}
          isLoading={false}
          error={null}
        />
      )}

      {/* User-Added Books - Only show if we have books */}
      {userAddedBooks.length > 0 && books.length >= 10 && (
        <BookCarousel
          books={userAddedBooks.slice(0, 8)}
          sectionId="userAddedBooks"
          title="Community Added Books"
          description={`${userAddedBooks.length} books added by users from OpenLibrary`}
          isLoading={false}
          error={null}
        />
      )}

      {/* Enhanced EPUB Reader Modal with Streaming */}
      {selectedBook && (
        <EPUBReader 
          book={selectedBook} 
          onClose={handleCloseReader}
        />
      )}
    </div>
  );
};

export default PublicDomainBooksSection;
