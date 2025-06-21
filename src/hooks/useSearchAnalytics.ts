
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SearchAnalyticsEntry {
  id: string;
  query: string;
  category: string | null;
  result_count: number;
  source_type: string;
  created_at: string;
}

export interface SearchCategoryData {
  name: string;
  value: number;
  color: string;
}

export const useSearchAnalytics = () => {
  const { user } = useAuth();
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalyticsEntry[]>([]);
  const [categoryData, setCategoryData] = useState<SearchCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSearchAnalytics = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('search_analytics')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        setSearchAnalytics(data || []);
        
        // Process category data
        const categoryMap = new Map<string, number>();
        (data || []).forEach(entry => {
          if (entry.category) {
            categoryMap.set(entry.category, (categoryMap.get(entry.category) || 0) + 1);
          }
        });

        // Convert to chart format with predefined colors
        const colors = ['#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#10B981', '#8B5A2B'];
        const processedData = Array.from(categoryMap.entries())
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([name, value], index) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: colors[index % colors.length]
          }));

        setCategoryData(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching search analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch search analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchAnalytics();
  }, [user?.id]);

  const trackSearch = async (query: string, category: string | null, resultCount: number, sourceType: string = 'library') => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('search_analytics')
        .insert({
          user_id: user.id,
          query,
          category,
          result_count: resultCount,
          source_type: sourceType
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error tracking search:', err);
    }
  };

  return {
    searchAnalytics,
    categoryData,
    loading,
    error,
    trackSearch
  };
};
