
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export const usePublicDomainBooks = () => {
  const { data: books = [], isLoading, error, refetch } = useQuery({
    queryKey: ['publicDomainBooks'],
    queryFn: async (): Promise<PublicDomainBook[]> => {
      console.log('🔄 Fetching public domain books from Supabase...');
      
      const { data, error } = await supabase
        .from('public_domain_books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching public domain books:', error);
        throw new Error(`Failed to fetch books: ${error.message}`);
      }

      console.log(`✅ Loaded ${data?.length || 0} books from database`);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    books,
    isLoading,
    error: error?.message || null,
    refetch
  };
};

