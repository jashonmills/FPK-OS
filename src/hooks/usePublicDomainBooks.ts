
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { supabase } from '@/integrations/supabase/client';

export const usePublicDomainBooks = () => {
  const { data: books = [], isLoading, error, refetch } = useQuery({
    queryKey: ['publicDomainBooks'],
    queryFn: async (): Promise<PublicDomainBook[]> => {
      console.log('🔄 Loading public domain books from database...');
      
      const { data, error } = await supabase
        .from('public_domain_books')
        .select('*')
        .order('is_user_added', { ascending: true }) // Show curated books first
        .order('created_at', { ascending: false }); // Then newest user-added books
      
      if (error) {
        console.error('❌ Error fetching public domain books:', error);
        throw new Error(`Failed to fetch books: ${error.message}`);
      }
      
      console.log(`✅ Loaded ${data?.length || 0} books from database`);
      
      // Type assertion to ensure the data conforms to our PublicDomainBook interface
      return (data || []).map(book => ({
        ...book,
        download_status: book.download_status as 'pending' | 'downloading' | 'completed' | 'failed',
        is_user_added: book.is_user_added || false,
        openlibrary_key: book.openlibrary_key || undefined
      })) as PublicDomainBook[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter stale time for faster updates
    refetchOnWindowFocus: false
  });

  return {
    books,
    isLoading,
    error: error?.message || null,
    refetch
  };
};
