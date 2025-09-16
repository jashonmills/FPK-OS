import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { analyticsEventBus } from '@/services/AnalyticsEventBus';

interface AIRecommendation {
  id: string;
  type: 'break_suggestion' | 'difficulty_adjustment' | 'content_format_change' | 'attention_support' | 'energy_boost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionText: string;
  actionData: Record<string, any>;
  triggerReason: string;
  confidence: number;
  expiresAt: string;
  autoApply?: boolean;
}

interface RecommendationTrigger {
  metric: string;
  threshold: number;
  direction: 'above' | 'below';
  duration?: number; // How long condition must persist
}

export const useRealtimeRecommendations = () => {
  const { user } = useAuth();
  const [activeRecommendations, setActiveRecommendations] = useState<AIRecommendation[]>([]);
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<RecommendationTrigger[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<Record<string, number>>({});

  // Initialize recommendation triggers
  useEffect(() => {
    const defaultTriggers: RecommendationTrigger[] = [
      { metric: 'attention_score', threshold: 50, direction: 'below', duration: 120 },
      { metric: 'cognitive_load', threshold: 80, direction: 'above', duration: 180 },
      { metric: 'energy_level', threshold: 30, direction: 'below', duration: 60 },
      { metric: 'slide_duration', threshold: 300, direction: 'above', duration: 0 },
      { metric: 'interaction_frequency', threshold: 0.1, direction: 'below', duration: 180 },
      { metric: 'error_rate', threshold: 0.7, direction: 'above', duration: 0 }
    ];
    
    setTriggers(defaultTriggers);
  }, []);

  // Monitor metrics and generate recommendations
  const processMetricUpdate = useCallback(async (metric: string, value: number, context: Record<string, any>) => {
    if (!user?.id) return;

    // Update current metrics
    setCurrentMetrics(prev => ({ ...prev, [metric]: value }));

    // Check triggers
    const triggeredRecommendations: AIRecommendation[] = [];

    for (const trigger of triggers) {
      if (trigger.metric === metric) {
        const shouldTrigger = trigger.direction === 'above' 
          ? value > trigger.threshold 
          : value < trigger.threshold;

        if (shouldTrigger) {
          const recommendation = await generateRecommendation(trigger, value, context);
          if (recommendation) {
            triggeredRecommendations.push(recommendation);
          }
        }
      }
    }

    // Add new recommendations
    if (triggeredRecommendations.length > 0) {
      setActiveRecommendations(prev => {
        const existing = prev.map(r => r.id);
        const newRecs = triggeredRecommendations.filter(r => !existing.includes(r.id));
        return [...prev, ...newRecs];
      });

      // Store in database
      for (const rec of triggeredRecommendations) {
        await supabase
          .from('ai_recommendations')
          .insert({
            user_id: user.id,
            recommendation_type: rec.type,
            recommendation_data: {
              title: rec.title,
              message: rec.message,
              actionText: rec.actionText,
              actionData: rec.actionData,
              confidence: rec.confidence,
              priority: rec.priority
            },
            trigger_context: {
              metric,
              value,
              threshold: trigger.threshold,
              ...context
            },
            expires_at: rec.expiresAt
          });
      }

      console.log(`🤖 Generated ${triggeredRecommendations.length} real-time recommendations`);
    }
  }, [user?.id, triggers]);

  // Generate specific recommendation based on trigger
  const generateRecommendation = useCallback(async (
    trigger: RecommendationTrigger, 
    value: number, 
    context: Record<string, any>
  ): Promise<AIRecommendation | null> => {
    const id = `${trigger.metric}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    switch (trigger.metric) {
      case 'attention_score':
        return {
          id,
          type: 'attention_support',
          priority: value < 30 ? 'urgent' : 'high',
          title: 'Attention Support Needed',
          message: `Your attention score has dropped to ${Math.round(value)}%. Let's help you refocus!`,
          actionText: 'Take Focus Break',
          actionData: {
            breakType: 'attention_restoration',
            duration: 120, // 2 minutes
            activities: ['deep_breathing', 'eye_exercises', 'quick_meditation']
          },
          triggerReason: 'Low attention detected',
          confidence: 0.85,
          expiresAt,
          autoApply: false
        };

      case 'cognitive_load':
        return {
          id,
          type: 'difficulty_adjustment',
          priority: 'high',
          title: 'Reduce Cognitive Load',
          message: `The current content seems challenging (${Math.round(value)}% load). Would you like to adjust the difficulty?`,
          actionText: 'Simplify Content',
          actionData: {
            adjustmentType: 'reduce_complexity',
            targetLoad: 50,
            modifications: ['add_hints', 'break_into_steps', 'provide_examples']
          },
          triggerReason: 'High cognitive load detected',
          confidence: 0.78,
          expiresAt
        };

      case 'energy_level':
        return {
          id,
          type: 'energy_boost',
          priority: 'medium',
          title: 'Energy Boost Recommended',
          message: `Your energy level is at ${Math.round(value)}%. Time for an energy break!`,
          actionText: 'Energize Me',
          actionData: {
            boostType: 'energy_restoration',
            duration: 300, // 5 minutes
            activities: ['energy_bear_interaction', 'movement_break', 'motivational_content']
          },
          triggerReason: 'Low energy detected',
          confidence: 0.82,
          expiresAt
        };

      case 'slide_duration':
        return {
          id,
          type: 'break_suggestion',
          priority: 'medium',
          title: 'Time for a Break',
          message: `You've been on this slide for ${Math.round(value / 60)} minutes. A short break might help!`,
          actionText: 'Take Break',
          actionData: {
            breakType: 'micro_break',
            duration: 180,
            returnToSlide: true
          },
          triggerReason: 'Extended time on single slide',
          confidence: 0.75,
          expiresAt
        };

      case 'interaction_frequency':
        return {
          id,
          type: 'content_format_change',
          priority: 'medium',
          title: 'Try Different Format',
          message: 'You seem less engaged with this content. Would you like to try a different format?',
          actionText: 'Change Format',
          actionData: {
            formatOptions: ['interactive_video', 'audio_narration', 'visual_summary'],
            currentFormat: context.contentFormat || 'text'
          },
          triggerReason: 'Low interaction frequency',
          confidence: 0.70,
          expiresAt
        };

      case 'error_rate':
        return {
          id,
          type: 'difficulty_adjustment',
          priority: 'high',
          title: 'Adjust Difficulty Level',
          message: 'This seems challenging for you right now. Let\'s make it more manageable.',
          actionText: 'Make Easier',
          actionData: {
            adjustmentType: 'reduce_difficulty',
            errorRate: value,
            supportOptions: ['guided_practice', 'review_fundamentals', 'peer_examples']
          },
          triggerReason: 'High error rate detected',
          confidence: 0.88,
          expiresAt
        };

      default:
        return null;
    }
  }, []);

  // Apply recommendation
  const applyRecommendation = useCallback(async (recommendation: AIRecommendation) => {
    if (!user?.id) return;

    try {
      // Mark as applied
      setAppliedRecommendations(prev => [...prev, recommendation.id]);
      
      // Remove from active recommendations
      setActiveRecommendations(prev => prev.filter(r => r.id !== recommendation.id));

      // Update in database
      await supabase
        .from('ai_recommendations')
        .update({ applied_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('recommendation_type', recommendation.type);

      // Publish application event
      analyticsEventBus.publish({
        userId: user.id,
        eventType: 'recommendation_applied',
        metadata: {
          recommendationId: recommendation.id,
          type: recommendation.type,
          actionData: recommendation.actionData,
          triggerReason: recommendation.triggerReason
        },
        source: 'realtime_recommendations'
      });

      // Execute recommendation action based on type
      await executeRecommendationAction(recommendation);

      console.log(`✅ Applied recommendation: ${recommendation.title}`);
    } catch (error) {
      console.error('Error applying recommendation:', error);
    }
  }, [user?.id]);

  // Dismiss recommendation
  const dismissRecommendation = useCallback(async (recommendationId: string, reason?: string) => {
    if (!user?.id) return;

    setActiveRecommendations(prev => prev.filter(r => r.id !== recommendationId));

    // Log dismissal
    analyticsEventBus.publish({
      userId: user.id,
      eventType: 'recommendation_dismissed',
      metadata: {
        recommendationId,
        dismissReason: reason || 'user_dismissed'
      },
      source: 'realtime_recommendations'
    });

    console.log(`❌ Dismissed recommendation: ${recommendationId}`);
  }, [user?.id]);

  // Rate recommendation effectiveness
  const rateRecommendation = useCallback(async (recommendationId: string, rating: number, feedback?: string) => {
    if (!user?.id) return;

    try {
      // Update recommendation with rating
      await supabase
        .from('ai_recommendations')
        .update({ 
          effectiveness_rating: rating,
          // Store feedback in metadata if provided
        })
        .eq('user_id', user.id);

      // Log rating event
      analyticsEventBus.publish({
        userId: user.id,
        eventType: 'recommendation_rated',
        metadata: {
          recommendationId,
          rating,
          feedback
        },
        source: 'realtime_recommendations'
      });

      console.log(`⭐ Rated recommendation ${recommendationId}: ${rating}/5`);
    } catch (error) {
      console.error('Error rating recommendation:', error);
    }
  }, [user?.id]);

  // Execute recommendation actions
  const executeRecommendationAction = async (recommendation: AIRecommendation) => {
    switch (recommendation.type) {
      case 'break_suggestion':
        // Trigger break modal or redirect to break activity
        window.dispatchEvent(new CustomEvent('show-break-modal', { 
          detail: recommendation.actionData 
        }));
        break;

      case 'difficulty_adjustment':
        // Adjust content difficulty
        window.dispatchEvent(new CustomEvent('adjust-difficulty', { 
          detail: recommendation.actionData 
        }));
        break;

      case 'content_format_change':
        // Change content format
        window.dispatchEvent(new CustomEvent('change-content-format', { 
          detail: recommendation.actionData 
        }));
        break;

      case 'attention_support':
        // Show attention restoration activities
        window.dispatchEvent(new CustomEvent('show-attention-support', { 
          detail: recommendation.actionData 
        }));
        break;

      case 'energy_boost':
        // Trigger energy boosting activities
        window.dispatchEvent(new CustomEvent('show-energy-boost', { 
          detail: recommendation.actionData 
        }));
        break;
    }
  };

  // Clean up expired recommendations
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setActiveRecommendations(prev => 
        prev.filter(rec => new Date(rec.expiresAt) > now)
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Subscribe to analytics events for metric updates
  useEffect(() => {
    const unsubscribe = analyticsEventBus.subscribe({
      id: 'realtime-recommendations',
      eventTypes: ['slide_interaction', 'attention_pattern_detected', 'energy_level_changed'],
      callback: (event) => {
        const { metadata } = event;
        
        // Process different event types
        switch (event.eventType) {
          case 'attention_pattern_detected':
            processMetricUpdate('attention_score', metadata.attentionLevel, metadata);
            break;
          case 'energy_level_changed':
            processMetricUpdate('energy_level', metadata.energyLevel, metadata);
            break;
          case 'slide_interaction':
            processMetricUpdate('interaction_frequency', 1, metadata);
            break;
        }
      }
    });

    return unsubscribe;
  }, [processMetricUpdate]);

  return {
    activeRecommendations,
    appliedRecommendations,
    currentMetrics,
    applyRecommendation,
    dismissRecommendation,
    rateRecommendation,
    processMetricUpdate
  };
};