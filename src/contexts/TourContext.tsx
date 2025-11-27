import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type TourName = 
  | 'dashboard'
  | 'students'
  | 'groups'
  | 'courses'
  | 'iep'
  | 'goals_notes'
  | 'ai_assistant'
  | 'settings';

interface TourStatus {
  [key: string]: boolean; // Format: has_seen_{tourName}_tour
}

interface TourContextType {
  shouldShowTour: (tourName: TourName) => boolean;
  markTourComplete: (tourName: TourName) => Promise<void>;
  startTour: (tourName: TourName) => void;
  activeTour: TourName | null;
  tourStatuses: TourStatus | null;
  isLoadingStatuses: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentOrg } = useOrgContext();
  const [activeTour, setActiveTour] = useState<TourName | null>(null);
  const queryClient = useQueryClient();

  // Fetch tour completion statuses
  const { data: tourStatuses, isLoading: isLoadingStatuses } = useQuery({
    queryKey: ['tour-statuses', currentOrg?.organization_id, user?.id],
    queryFn: async () => {
      if (!currentOrg?.organization_id || !user?.id) return null;

      const { data, error } = await supabase
        .from('org_members')
        .select('has_seen_dashboard_tour, has_seen_students_tour, has_seen_groups_tour, has_seen_courses_tour, has_seen_iep_tour, has_seen_goals_notes_tour, has_seen_ai_assistant_tour, has_seen_settings_tour')
        .eq('org_id', currentOrg.organization_id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching tour statuses:', error);
        return null;
      }

      return data as TourStatus;
    },
    enabled: !!currentOrg?.organization_id && !!user?.id,
  });

  // Mutation to mark tour as complete
  const markCompleteMutation = useMutation({
    mutationFn: async (tourName: TourName) => {
      if (!currentOrg?.organization_id || !user?.id) throw new Error('No org or user');

      const { error } = await supabase.rpc('mark_tour_complete', {
        p_org_id: currentOrg.organization_id,
        p_user_id: user.id,
        p_tour_name: tourName,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-statuses'] });
    },
  });

  const shouldShowTour = useCallback((tourName: TourName): boolean => {
    if (!tourStatuses || activeTour) return false;
    const key = `has_seen_${tourName}_tour` as keyof TourStatus;
    return tourStatuses[key] === false;
  }, [tourStatuses, activeTour]);

  const markTourComplete = useCallback(async (tourName: TourName) => {
    await markCompleteMutation.mutateAsync(tourName);
    setActiveTour(null);
  }, [markCompleteMutation]);

  const startTour = useCallback((tourName: TourName) => {
    setActiveTour(tourName);
  }, []);

  return (
    <TourContext.Provider value={{
      shouldShowTour,
      markTourComplete,
      startTour,
      activeTour,
      tourStatuses,
      isLoadingStatuses,
    }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
