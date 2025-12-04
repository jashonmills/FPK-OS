
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuizletSet, QuizletSetDetails } from '@/types/quizlet';

export const useQuizletSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<QuizletSet[]>([]);

  const searchSets = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Searching Quizlet for:', query);
      
      const { data, error } = await supabase.functions.invoke('quizlet-proxy', {
        body: { 
          action: 'search',
          query: query.trim()
        }
      });

      if (error) {
        console.error('❌ Quizlet search error:', error);
        throw new Error(error.message || 'Search failed');
      }

      const results = data?.sets || [];
      console.log(`✅ Found ${results.length} Quizlet sets`);
      
      setSearchResults(results);
      return results;
    } catch (err) {
      console.error('❌ Quizlet search error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setSearchResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSetDetails = useCallback(async (setId: string): Promise<QuizletSetDetails | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📚 Fetching Quizlet set details for:', setId);
      
      const { data, error } = await supabase.functions.invoke('quizlet-proxy', {
        body: { 
          action: 'getSet',
          setId: setId
        }
      });

      if (error) {
        console.error('❌ Quizlet set fetch error:', error);
        throw new Error(error.message || 'Failed to fetch set details');
      }

      console.log(`✅ Fetched Quizlet set with ${data?.terms?.length || 0} terms`);
      return data;
    } catch (err) {
      console.error('❌ Quizlet set fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch set details';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchSets,
    getSetDetails,
    clearResults
  };
};
