
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Book, OpenLibrarySearchResponse } from '@/types/library';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useLibrarySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['librarySearch', searchQuery, currentPage],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      
      const offset = currentPage * resultsPerPage;
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=${resultsPerPage}&offset=${offset}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search library');
      }
      
      const data: OpenLibrarySearchResponse = await response.json();
      
      // Transform the data to match our Book interface
      const books: Book[] = data.docs.map(doc => ({
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name,
        first_publish_year: doc.first_publish_year,
        cover_i: doc.cover_i,
        isbn: doc.isbn,
        publisher: doc.publisher,
        subject: doc.subject,
        workKey: doc.key
      }));
      
      return {
        books,
        total: data.numFound,
        hasMore: offset + resultsPerPage < data.numFound
      };
    },
    enabled: !!searchQuery.trim(),
    staleTime: CACHE_DURATION,
    refetchOnWindowFocus: false
  });

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  }, []);

  const loadMore = useCallback(() => {
    if (data?.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [data?.hasMore]);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(0);
  }, []);

  return {
    searchQuery,
    books: data?.books || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    search,
    loadMore,
    resetSearch,
    refetch
  };
};
