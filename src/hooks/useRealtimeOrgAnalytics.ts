import { useQueryClient } from '@tanstack/react-query';
import { useOrgAnalytics } from './useOrgAnalytics';
import { useRealtimeChannel } from './useRealtimeChannel';
import { useCallback, useRef } from 'react';

export function useRealtimeOrgAnalytics(organizationId?: string) {
  const queryClient = useQueryClient();
  const analytics = useOrgAnalytics(organizationId);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Debounced invalidation to prevent excessive re-fetching
  const invalidateAnalytics = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      console.log('[Realtime Analytics] Invalidating queries for org:', organizationId);
      queryClient.invalidateQueries({ queryKey: ['org-analytics', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['org-statistics', organizationId] });
    }, 1000); // 1 second debounce
  }, [organizationId, queryClient]);

  // Subscribe to course enrollments
  useRealtimeChannel(
    `org-enrollments-${organizationId}`,
    {
      event: '*',
      table: 'interactive_course_enrollments',
      filter: `org_id=eq.${organizationId}`,
    },
    invalidateAnalytics
  );

  // Subscribe to lesson analytics
  useRealtimeChannel(
    `org-lessons-${organizationId}`,
    {
      event: '*',
      table: 'interactive_lesson_analytics',
      filter: `org_id=eq.${organizationId}`,
    },
    invalidateAnalytics
  );

  // Subscribe to activity log
  useRealtimeChannel(
    `org-activity-${organizationId}`,
    {
      event: 'INSERT',
      table: 'activity_log',
      filter: `org_id=eq.${organizationId}`,
    },
    invalidateAnalytics
  );

  // Subscribe to goals
  useRealtimeChannel(
    `org-goals-rt-${organizationId}`,
    {
      event: '*',
      table: 'org_goals',
      filter: `organization_id=eq.${organizationId}`,
    },
    invalidateAnalytics
  );

  // Subscribe to notes
  useRealtimeChannel(
    `org-notes-rt-${organizationId}`,
    {
      event: '*',
      table: 'org_notes',
      filter: `organization_id=eq.${organizationId}`,
    },
    invalidateAnalytics
  );

  // Subscribe to course sessions
  useRealtimeChannel(
    `org-sessions-${organizationId}`,
    {
      event: '*',
      table: 'interactive_course_sessions',
      filter: `org_id=eq.${organizationId}`,
    },
    invalidateAnalytics
  );

  return analytics;
}
