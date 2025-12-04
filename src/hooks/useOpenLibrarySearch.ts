
import { useState, useCallback } from 'react';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

interface OpenLibrarySearchResponse {
  docs: OpenLibraryBook[];
  numFound: number;
}

export const useOpenLibrarySearch = () => {
  const [books, setBooks] = useState<OpenLibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Searching OpenLibrary for:', query);
      
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,cover_i,first_publish_year`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data: OpenLibrarySearchResponse = await response.json();
      
      console.log(`✅ Found ${data.docs.length} books from OpenLibrary`);
      
      // Filter out books without titles and deduplicate
      const filteredBooks = data.docs
        .filter(book => book.title && book.title.trim())
        .slice(0, 10);

      setBooks(filteredBooks);
    } catch (err) {
      console.error('❌ OpenLibrary search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setBooks([]);
    setError(null);
  }, []);

  return {
    books,
    isLoading,
    error,
    searchBooks,
    clearResults
  };
};
