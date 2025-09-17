
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ReadingBook {
  id: string;
  user_id: string;
  book_id: string;
  current_cfi?: string;
  chapter_index: number;
  reading_time_seconds: number;
  completion_percentage: number;
  last_read_at: string;
  created_at: string;
  updated_at: string;
}

export const useCurrentReadingBooks = () => {
  const { user } = useAuth();
  const subscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['currentReadingBooks', user?.id],
    queryFn: async (): Promise<ReadingBook[]> => {
      if (!user?.id) {
        console.log('📚 No user ID, returning empty array');
        return [];
      }

      console.log('📚 Loading current reading books for user:', user.id);
      
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_read_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching reading books:', error);
        throw new Error(`Failed to fetch reading books: ${error.message}`);
      }
      
      console.log('✅ Loaded reading books:', data?.length || 0);
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Set up real-time subscription with proper cleanup
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    // Prevent multiple subscriptions
    if (subscriptionRef.current || isSubscribed) {
      return;
    }

    const setupSubscription = () => {
      try {
        console.log('🔄 Setting up reading progress subscription for user:', user.id);
        
        const channel = supabase
          .channel(`reading-progress-${user.id}-${Date.now()}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'reading_progress',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('📚 Reading progress change detected:', payload);
              refetch();
            }
          )
          .subscribe((status) => {
            console.log('📚 Reading progress subscription status:', status);
            if (status === 'SUBSCRIBED') {
              setIsSubscribed(true);
            }
            if (status === 'CLOSED') {
              setIsSubscribed(false);
            }
          });

        subscriptionRef.current = channel;
      } catch (error) {
        console.error('❌ Error setting up reading progress subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      if (subscriptionRef.current) {
        console.log('🧹 Cleaning up reading progress subscription');
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        setIsSubscribed(false);
      }
    };
  }, [user?.id, refetch]); // Removed isSubscribed from dependencies to prevent loops

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
  };
};
