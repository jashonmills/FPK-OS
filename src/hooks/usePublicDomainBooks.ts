
import { useState, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { supabase } from '@/integrations/supabase/client';

export const usePublicDomainBooks = () => {
  const [books, setBooks] = useState<PublicDomainBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicDomainBooks();
  }, []);

  const fetchPublicDomainBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching public domain books from Supabase...');
      
      // Fetch books from the public_domain_books table
      const { data, error: supabaseError } = await supabase
        .from('public_domain_books')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(50);

      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      if (!data || data.length === 0) {
        console.log('📚 No books found in database, triggering OPDS ingestion...');
        
        // Trigger OPDS ingestion if no books exist
        const { error: functionError } = await supabase.functions.invoke('opds-ingestion');
        
        if (functionError) {
          console.error('❌ OPDS ingestion error:', functionError);
          throw new Error('Failed to fetch books from Project Gutenberg');
        }

        // Retry fetching after ingestion
        const { data: newData, error: retryError } = await supabase
          .from('public_domain_books')
          .select('*')
          .order('last_updated', { ascending: false })
          .limit(50);

        if (retryError) {
          throw new Error(retryError.message);
        }

        setBooks(newData || []);
      } else {
        console.log(`✅ Loaded ${data.length} books from database`);
        setBooks(data);
      }
      
    } catch (err) {
      console.error('❌ Error fetching public domain books:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    books,
    isLoading,
    error,
    refetch: fetchPublicDomainBooks
  };
};
