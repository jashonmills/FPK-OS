import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CoachAnalytics {
  masteryScore: number;
  learningTimeMinutes: number;
  topicsExplored: string[];
  sessionStreak: number;
  modeRatio: {
    socratic: number;
    freeChat: number;
    socraticPercent: number;
    total: number;
  };
}

export function useCoachAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CoachAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchAnalytics() {
      try {
        setLoading(true);

        // Call all analytics functions in parallel - ONLY coach_portal data
        const [masteryResult, timeResult, topicsResult, streakResult, ratioResult] = await Promise.all([
          supabase.rpc('get_coach_mastery_score', { p_user_id: user.id, p_source: 'coach_portal' }),
          supabase.rpc('get_coach_learning_time', { p_user_id: user.id, p_source: 'coach_portal' }),
          supabase.rpc('get_coach_topics', { p_user_id: user.id, p_source: 'coach_portal' }),
          supabase.rpc('get_coach_streak', { p_user_id: user.id }),
          supabase.rpc('get_coach_mode_ratio', { p_user_id: user.id, p_source: 'coach_portal' })
        ]);

        if (masteryResult.error) throw masteryResult.error;
        if (timeResult.error) throw timeResult.error;
        if (topicsResult.error) throw topicsResult.error;
        if (streakResult.error) throw streakResult.error;
        if (ratioResult.error) throw ratioResult.error;

        setAnalytics({
          masteryScore: masteryResult.data || 0,
          learningTimeMinutes: timeResult.data || 0,
          topicsExplored: topicsResult.data || [],
          sessionStreak: streakResult.data || 0,
          modeRatio: (ratioResult.data as any) || {
            socratic: 0,
            freeChat: 0,
            socraticPercent: 0,
            total: 0
          }
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching coach analytics:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [user?.id]);

  return { analytics, loading, error };
}