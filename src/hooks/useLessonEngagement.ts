import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getActiveOrgId } from '@/lib/org/context';

interface EngagementMetrics {
  interactionCount: number;
  scrollDepth: number;
  timeSpent: number;
  engagementScore: number;
}

export function useLessonEngagement(courseId: string, lessonId: number, lessonTitle: string) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    interactionCount: 0,
    scrollDepth: 0,
    timeSpent: 0,
    engagementScore: 0
  });

  const startTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const savedRef = useRef<boolean>(false);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercentage);
      
      setMetrics(prev => ({
        ...prev,
        scrollDepth: Math.round(maxScrollRef.current)
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setMetrics(prev => ({
        ...prev,
        timeSpent: elapsed
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate engagement score
  useEffect(() => {
    const { interactionCount, scrollDepth, timeSpent } = metrics;
    
    // Engagement score formula (0-100)
    const interactionScore = Math.min(interactionCount * 5, 30); // Max 30 points
    const scrollScore = Math.min(scrollDepth * 0.4, 40); // Max 40 points
    const timeScore = Math.min(timeSpent * 0.5, 30); // Max 30 points (1 min = 30 points)
    
    const engagementScore = Math.round(interactionScore + scrollScore + timeScore);
    
    setMetrics(prev => ({
      ...prev,
      engagementScore: Math.min(engagementScore, 100)
    }));
  }, [metrics.interactionCount, metrics.scrollDepth, metrics.timeSpent]);

  // Track interaction
  const trackInteraction = useCallback((type: string, details?: any) => {
    setMetrics(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1
    }));

    // Log interaction to analytics_metrics
    if (user?.id) {
      supabase.from('analytics_metrics').insert({
        user_id: user.id,
        metric_name: 'lesson_interaction',
        value: 1,
        metadata: {
          course_id: courseId,
          lesson_id: lessonId,
          interaction_type: type,
          details
        }
      }).then(({ error }) => {
        if (error) console.error('Failed to log interaction:', error);
      });
    }
  }, [user?.id, courseId, lessonId]);

  // Save analytics to database
  const saveAnalytics = useCallback(async (completionStatus: 'completed' | 'in_progress' = 'in_progress') => {
    if (!user?.id || savedRef.current) return;

    try {
      const orgId = getActiveOrgId();
      
      const { error } = await supabase
        .from('interactive_lesson_analytics')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          lesson_title: lessonTitle,
          time_spent_seconds: metrics.timeSpent,
          engagement_score: metrics.engagementScore,
          interactions_count: metrics.interactionCount,
          scroll_depth_percentage: metrics.scrollDepth,
          org_id: orgId,
          completed_at: completionStatus === 'completed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (error) throw error;
      savedRef.current = true;
    } catch (error) {
      console.error('Error saving lesson analytics:', error);
    }
  }, [user?.id, courseId, lessonId, lessonTitle, metrics]);

  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      saveAnalytics('in_progress');
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [saveAnalytics]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveAnalytics('in_progress');
    };
  }, [saveAnalytics]);

  return {
    metrics,
    trackInteraction,
    saveAnalytics
  };
}
