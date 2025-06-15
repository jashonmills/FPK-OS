
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { supabase } from '@/integrations/supabase/client';

export const usePublicDomainBooks = (limit?: number) => {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const { data: books = [], isLoading, error, refetch } = useQuery({
    queryKey: ['publicDomainBooks', limit],
    queryFn: async (): Promise<PublicDomainBook[]> => {
      console.log('🔄 Loading public domain books from database...');
      
      let query = supabase
        .from('public_domain_books')
        .select('*')
        .order('is_user_added', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply limit for progressive loading
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching public domain books:', error);
        throw new Error(`Failed to fetch books: ${error.message}`);
      }
      
      console.log(`✅ Loaded ${data?.length || 0} books from database`);
      
      // Enhanced book processing with better URL handling
      return (data || []).map(book => {
        const processedBook: PublicDomainBook = {
          ...book,
          download_status: book.download_status as 'pending' | 'downloading' | 'completed' | 'failed',
          is_user_added: book.is_user_added || false,
          openlibrary_key: book.openlibrary_key || undefined,
          // Ensure we have reliable EPUB URLs
          epub_url: book.epub_url || `https://www.gutenberg.org/ebooks/${book.gutenberg_id}.epub.noimages`
        };

        // Add backup URLs for Project Gutenberg books (not from database, generated here)
        if (book.gutenberg_id && !book.storage_url) {
          const backupUrls = [
            `https://www.gutenberg.org/ebooks/${book.gutenberg_id}.epub.noimages`,
            `https://www.gutenberg.org/cache/epub/${book.gutenberg_id}/pg${book.gutenberg_id}.epub`,
            `https://www.gutenberg.org/files/${book.gutenberg_id}/${book.gutenberg_id}-0.epub`
          ];
          processedBook.backup_urls = backupUrls;
        }

        return processedBook;
      });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (failureCount < maxRetries) {
        setRetryCount(failureCount + 1);
        console.log(`🔄 Retrying books fetch... Attempt ${failureCount + 1}/${maxRetries}`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const handleManualRetry = () => {
    setRetryCount(0);
    refetch();
  };

  return {
    books,
    isLoading,
    error: error?.message || null,
    refetch: handleManualRetry,
    retryCount,
    hasMore: limit ? books.length === limit : false
  };
};
