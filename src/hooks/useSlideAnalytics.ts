import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { analyticsEventBus } from '@/services/AnalyticsEventBus';
import { useCleanup } from '@/utils/cleanupManager';

interface SlideView {
  slideId: string;
  slideTitle: string;
  startTime: number;
  interactions: number;
  attentionScore: number;
  cognitiveLoad: number;
}

export const useSlideAnalytics = (
  courseId: string,
  lessonId?: string
) => {
  const cleanup = useCleanup('slide-analytics');
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState<SlideView | null>(null);
  const [slideHistory, setSlideHistory] = useState<SlideView[]>([]);
  const attentionTimerRef = useRef<string>();
  const inactivityTimerRef = useRef<string>();
  const lastActivityRef = useRef<number>(Date.now());

  // Track slide view start
  const startSlideView = useCallback((slideId: string, slideTitle: string) => {
    if (!user?.id) return;

    // End previous slide if exists
    if (currentSlide) {
      endSlideView();
    }

    const slideView: SlideView = {
      slideId,
      slideTitle,
      startTime: Date.now(),
      interactions: 0,
      attentionScore: 100, // Start at full attention
      cognitiveLoad: 0
    };

    setCurrentSlide(slideView);
    lastActivityRef.current = Date.now();

    // Track slide view start event
    analyticsEventBus.publish({
      userId: user.id,
      eventType: 'slide_view_start',
      metadata: {
        courseId,
        lessonId,
        slideId,
        slideTitle,
        timestamp: new Date().toISOString()
      },
      source: 'slide_tracking'
    });

    // Start attention monitoring
    startAttentionMonitoring();

    console.log(`🔍 Started slide view: ${slideId}`);
  }, [user?.id, courseId, lessonId, currentSlide]);

  // Track slide interaction
  const trackSlideInteraction = useCallback((interactionType: string, interactionData?: Record<string, any>) => {
    if (!currentSlide || !user?.id) return;

    lastActivityRef.current = Date.now();
    
    setCurrentSlide(prev => prev ? {
      ...prev,
      interactions: prev.interactions + 1,
      attentionScore: Math.min(100, prev.attentionScore + 2) // Small attention boost
    } : null);

    // Store slide interaction
    supabase
      .from('slide_analytics')
      .insert({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        slide_id: currentSlide.slideId,
        slide_title: currentSlide.slideTitle,
        event_type: 'interaction',
        interaction_data: {
          type: interactionType,
          ...interactionData,
          timestamp: new Date().toISOString()
        },
        attention_score: currentSlide.attentionScore,
        cognitive_load_indicator: currentSlide.cognitiveLoad
      })
      .then(({ error }) => {
        if (error) console.error('Error tracking slide interaction:', error);
      });

    // Publish to event bus
    analyticsEventBus.publish({
      userId: user.id,
      eventType: 'slide_interaction',
      metadata: {
        courseId,
        lessonId,
        slideId: currentSlide.slideId,
        interactionType,
        attentionScore: currentSlide.attentionScore,
        ...interactionData
      },
      source: 'slide_tracking'
    });

    console.log(`🖱️ Slide interaction: ${interactionType} on ${currentSlide.slideId}`);
  }, [currentSlide, user?.id, courseId, lessonId]);

  // Track slide completion
  const markSlideComplete = useCallback((completionQuality?: Record<string, any>) => {
    if (!currentSlide || !user?.id) return;

    const duration = Math.floor((Date.now() - currentSlide.startTime) / 1000);

    // Store slide completion
    supabase
      .from('slide_analytics')
      .insert({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        slide_id: currentSlide.slideId,
        slide_title: currentSlide.slideTitle,
        event_type: 'completion',
        duration_seconds: duration,
        completion_status: 'completed',
        interaction_data: completionQuality || {},
        attention_score: currentSlide.attentionScore,
        cognitive_load_indicator: currentSlide.cognitiveLoad
      })
      .then(({ error }) => {
        if (error) console.error('Error marking slide complete:', error);
      });

    // Update lesson progress
    supabase
      .from('lesson_progress_detailed')
      .upsert({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId || 'overview',
        slide_id: currentSlide.slideId,
        progress_percentage: 100,
        time_spent_seconds: duration,
        interaction_count: currentSlide.interactions,
        attention_metrics: {
          finalScore: currentSlide.attentionScore,
          averageScore: currentSlide.attentionScore, // Simplified for now
          peakScore: 100,
          lowScore: Math.max(0, currentSlide.attentionScore - 20)
        },
        learning_velocity: currentSlide.interactions / Math.max(duration / 60, 1), // interactions per minute
        difficulty_perception: currentSlide.cognitiveLoad,
        completion_quality: completionQuality || {}
      }, {
        onConflict: 'user_id,course_id,lesson_id,slide_id'
      })
      .then(({ error }) => {
        if (error) console.error('Error updating detailed progress:', error);
      });

    console.log(`✅ Slide completed: ${currentSlide.slideId} in ${duration}s`);
  }, [currentSlide, user?.id, courseId, lessonId]);

  // End current slide view
  const endSlideView = useCallback(() => {
    if (!currentSlide || !user?.id) return;

    const duration = Math.floor((Date.now() - currentSlide.startTime) / 1000);

    // Store slide view end
    supabase
      .from('slide_analytics')
      .insert({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        slide_id: currentSlide.slideId,
        slide_title: currentSlide.slideTitle,
        event_type: 'view_end',
        duration_seconds: duration,
        attention_score: currentSlide.attentionScore,
        cognitive_load_indicator: currentSlide.cognitiveLoad,
        metadata: {
          totalInteractions: currentSlide.interactions,
          viewQuality: calculateViewQuality(currentSlide, duration)
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error ending slide view:', error);
      });

    // Add to history
    setSlideHistory(prev => [...prev, { ...currentSlide }]);
    
    // Clear current slide
    setCurrentSlide(null);
    
    // Clear timers using cleanupManager
    if (attentionTimerRef.current) cleanup.cleanup(attentionTimerRef.current);
    if (inactivityTimerRef.current) cleanup.cleanup(inactivityTimerRef.current);

    console.log(`⏹️ Ended slide view: ${currentSlide.slideId} after ${duration}s`);
  }, [currentSlide, user?.id, courseId, lessonId, cleanup]);

  // Start attention monitoring
  const startAttentionMonitoring = useCallback(() => {
    // Clear existing timers using cleanupManager
    if (attentionTimerRef.current) cleanup.cleanup(attentionTimerRef.current);
    if (inactivityTimerRef.current) cleanup.cleanup(inactivityTimerRef.current);

    // Monitor attention every 5 seconds using cleanupManager
    attentionTimerRef.current = cleanup.setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      
      setCurrentSlide(prev => {
        if (!prev) return null;

        let attentionDecay = 0;
        let cognitiveLoadIncrease = 0;

        // Attention decreases with inactivity
        if (timeSinceActivity > 10000) { // 10 seconds of inactivity
          attentionDecay = Math.min(5, timeSinceActivity / 2000); // Max 5 points per check
        }

        // Cognitive load increases with time spent on slide
        const slideTime = (Date.now() - prev.startTime) / 1000;
        if (slideTime > 60) { // After 1 minute on same slide
          cognitiveLoadIncrease = Math.min(2, slideTime / 30000); // Gradual increase
        }

        return {
          ...prev,
          attentionScore: Math.max(0, prev.attentionScore - attentionDecay),
          cognitiveLoad: Math.min(100, prev.cognitiveLoad + cognitiveLoadIncrease)
        };
      });
    }, 5000);

    // Set inactivity timer for extended periods using cleanupManager
    inactivityTimerRef.current = cleanup.setTimeout(() => {
      setCurrentSlide(prev => prev ? {
        ...prev,
        attentionScore: Math.max(0, prev.attentionScore - 20), // Larger penalty for extended inactivity
        cognitiveLoad: Math.min(100, prev.cognitiveLoad + 10)
      } : null);
    }, 30000); // 30 seconds
  }, [cleanup]);

  // Calculate view quality based on engagement metrics
  const calculateViewQuality = (slide: SlideView, duration: number): Record<string, any> => {
    const engagementRate = slide.interactions / Math.max(duration / 10, 1); // interactions per 10 seconds
    const attentionQuality = slide.attentionScore / 100;
    const cognitiveEffort = 1 - (slide.cognitiveLoad / 100);
    
    return {
      engagementRate,
      attentionQuality,
      cognitiveEffort,
      overallQuality: (engagementRate * 0.4 + attentionQuality * 0.4 + cognitiveEffort * 0.2)
    };
  };

  // Track user activity for attention monitoring
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    document.addEventListener('click', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('scroll', handleActivity);
    document.addEventListener('mousemove', handleActivity);

    return () => {
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      document.removeEventListener('mousemove', handleActivity);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSlide) endSlideView();
    };
  }, [endSlideView, currentSlide]);

  return {
    currentSlide,
    slideHistory,
    startSlideView,
    trackSlideInteraction,
    markSlideComplete,
    endSlideView,
    isTracking: !!currentSlide
  };
};