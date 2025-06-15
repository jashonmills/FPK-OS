
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
import { RefreshCw, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { performanceService } from '@/services/PerformanceOptimizationService';
import { browsingPatternsAnalyzer } from '@/services/BrowsingPatternsAnalyzer';

const INITIAL_LOAD_LIMIT = 10;
const LOAD_MORE_AMOUNT = 20;

const PublicDomainBooksSection: React.FC = () => {
  const [loadLimit, setLoadLimit] = useState(INITIAL_LOAD_LIMIT);
  const [selectedBook, setSelectedBook] = useState<PublicDomainBook | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [browsingAnalytics, setBrowsingAnalytics] = useState<any>(null);
  const [prefetchSuggestions, setPrefetchSuggestions] = useState<PublicDomainBook[]>([]);
  
  const { books, isLoading, error, refetch, retryCount, hasMore } = usePublicDomainBooks(loadLimit);

  // Initialize performance optimizations and browsing analysis
  useEffect(() => {
    const initializeOptimizations = async () => {
      console.log('🚀 Initializing Phase 4 optimizations...');
      
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
    };

    if (!isLoading && books.length > 0) {
      initializeOptimizations();
    }
  }, [books, isLoading]);

  // Update analytics periodically
  useEffect(() => {
    const updateAnalytics = () => {
      const analytics = browsingPatternsAnalyzer.getAnalytics();
      setBrowsingAnalytics(analytics);
    };

    const interval = setInterval(updateAnalytics, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleBookClick = (book: PublicDomainBook) => {
    // Record book click for pattern analysis
    browsingPatternsAnalyzer.recordEvent(book.id, 'click', {
      title: book.title,
      author: book.author,
      subjects: book.subjects
    });
    
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
      {/* Phase 4 Performance & Analytics Dashboard */}
      {(performanceMetrics || browsingAnalytics) && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Phase 4: Search & UX Optimizations Active</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {performanceMetrics && (
              <>
                <div className="text-green-700">
                  <span className="font-medium">Search Index:</span> {performanceMetrics.prefetchedBooksCount} books
                </div>
                <div className="text-green-700">
                  <span className="font-medium">Instant Search:</span> Enabled
                </div>
              </>
            )}
            
            {browsingAnalytics && (
              <>
                <div className="text-blue-700">
                  <span className="font-medium">Session Events:</span> {browsingAnalytics.currentSession.eventCount}
                </div>
                <div className="text-blue-700">
                  <span className="font-medium">Smart Prefetch:</span> {prefetchSuggestions.length} books
                </div>
              </>
            )}
          </div>

          {/* Browsing Patterns */}
          {browsingAnalytics?.currentSession?.patterns?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Detected Patterns:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {browsingAnalytics.currentSession.patterns.map((pattern: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {pattern.replace(':', ': ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Public Domain Collection</h2>
        <p className="text-muted-foreground mb-6">
          Enhanced with instant search, smart suggestions, and intelligent prefetching
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
              Loading books with Phase 4 optimizations...
            </span>
          </div>
        </div>
      )}

      {/* Enhanced Virtualized List with Instant Search */}
      {books.length > 0 && (
        <>
          <div className="bg-background border rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">All Books - Enhanced Search & UX</h3>
              <p className="text-sm text-muted-foreground">
                Features instant search trie, debounced queries, and intelligent browsing pattern analysis
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
                Showing {books.length} books. Smart prefetching and instant search enabled.
              </p>
            </div>
          )}
        </>
      )}

      {/* Intelligent Prefetch Suggestions */}
      {prefetchSuggestions.length > 0 && books.length >= INITIAL_LOAD_LIMIT && (
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
      {curatedBooks.length > 0 && books.length >= INITIAL_LOAD_LIMIT && (
        <BookCarousel
          books={curatedBooks.slice(0, 8)}
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
        <EnhancedEPUBReader 
          book={selectedBook} 
          onClose={handleCloseReader}
        />
      )}
    </div>
  );
};

export default PublicDomainBooksSection;
