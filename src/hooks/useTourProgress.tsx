import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type TourKey = 
  | 'has_seen_dashboard_tour'
  | 'has_seen_activities_tour'
  | 'has_seen_goals_tour'
  | 'has_seen_analytics_tour'
  | 'has_seen_settings_tour'
  | 'has_seen_documents_tour';

export const useTourProgress = (tourKey: TourKey) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [shouldRunTour, setShouldRunTour] = useState(false);

  // Fetch tour progress
  const { data: tourProgress, isLoading } = useQuery({
    queryKey: ['tour-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_tour_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      // If no progress exists, create it
      if (!data) {
        const { data: newProgress, error: insertError } = await supabase
          .from('user_tour_progress')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        return newProgress;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Mark tour as seen
  const { mutate: markTourAsSeen } = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('user_tour_progress')
        .update({ [tourKey]: true })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-progress', user?.id] });
    },
  });

  // Determine if tour should run
  useEffect(() => {
    if (!isLoading && tourProgress) {
      const toursDisabled = tourProgress.tours_disabled || false;
      const hasSeenTour = tourProgress[tourKey] || false;
      setShouldRunTour(!toursDisabled && !hasSeenTour);
    }
  }, [tourProgress, isLoading, tourKey]);

  return {
    shouldRunTour,
    markTourAsSeen,
    isLoading,
  };
};
