import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { analyticsEventBus } from '@/services/AnalyticsEventBus';

interface BehavioralRecord {
  id?: string;
  user_id: string;
  session_id: string;
  behavior_type: string;
  behavior_data?: Record<string, unknown>;
  context_metadata?: Record<string, unknown>;
  pattern_indicators?: Record<string, unknown>;
  timestamp?: string;
}

interface BehavioralPattern {
  type: string;
  intensity: number;
  frequency: number;
  context: Record<string, unknown>;
}

export const useBehavioralAnalytics = (sessionId: string) => {
  const { user } = useAuth();
  const behaviorPatterns = useRef<Map<string, BehavioralPattern>>(new Map());
  const lastActivity = useRef<number>(Date.now());
  const energyLevel = useRef<number>(100);
  const focusLevel = useRef<number>(100);
  const preferenceProfile = useRef<Record<string, unknown>>({});

  // Track attention patterns
  const trackAttentionPattern = useCallback((level: number, duration: number, context: Record<string, unknown>) => {
    if (!user?.id) return;

    const behaviorData = {
      attentionLevel: level,
      durationSeconds: duration,
      focusQuality: level > 70 ? 'high' : level > 40 ? 'medium' : 'low',
      distractionCount: context.distractionCount || 0,
      recoveryTime: context.recoveryTime || 0
    };

    // Store in database
    supabase
      .from('behavioral_analytics')
      .insert({
        user_id: user.id,
        session_id: sessionId,
        behavior_type: 'attention_pattern',
        behavior_data: behaviorData,
        context_metadata: context,
        pattern_indicators: {
          sustainedAttention: duration > 300, // 5+ minutes
          deepFocus: level > 80,
          attentionFluctuation: Math.abs(level - focusLevel.current)
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error tracking attention pattern:', error);
      });

    // Update focus level
    focusLevel.current = level;

    // Publish event
    analyticsEventBus.publish({
      userId: user.id,
      eventType: 'attention_pattern_detected',
      metadata: {
        sessionId,
        attentionLevel: level,
        duration,
        context
      },
      source: 'behavioral_analytics'
    });

    console.log(`🧠 Attention pattern tracked: ${level}% for ${duration}s`);
  }, [user?.id, sessionId]);

  // Track self-regulation behavior
  const trackSelfRegulation = useCallback((action: string, trigger: string, effectiveness: number) => {
    if (!user?.id) return;

    const behaviorData = {
      action, // 'break_taken', 'energy_bear_used', 'calming_module_accessed', 'difficulty_adjusted'
      trigger, // 'stress_detected', 'fatigue_detected', 'user_initiated', 'ai_suggested'
      effectiveness, // 1-10 how well it helped
      timestamp: new Date().toISOString()
    };

    // Store in database
    supabase
      .from('behavioral_analytics')
      .insert({
        user_id: user.id,
        session_id: sessionId,
        behavior_type: 'self_regulation',
        behavior_data: behaviorData,
        context_metadata: {
          energyBefore: energyLevel.current,
          timeSinceLastBreak: Date.now() - lastActivity.current
        },
        pattern_indicators: {
          selfAwareness: trigger === 'user_initiated',
          toolUtilization: action.includes('energy_bear') || action.includes('calming'),
          adaptiveResponse: effectiveness >= 7
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error tracking self-regulation:', error);
      });

    // Update energy based on action effectiveness
    if (effectiveness >= 7) {
      energyLevel.current = Math.min(100, energyLevel.current + 10);
    }

    console.log(`🎯 Self-regulation tracked: ${action} (effectiveness: ${effectiveness})`);
  }, [user?.id, sessionId]);

  // Track learning style indicators
  const trackLearningStyle = useCallback((contentType: string, engagement: number, preference: number) => {
    if (!user?.id) return;

    const behaviorData = {
      contentType, // 'visual', 'auditory', 'kinesthetic', 'reading'
      engagementScore: engagement, // 0-100
      preferenceRating: preference, // 0-100
      interactionDuration: Date.now() - lastActivity.current,
      completionRate: engagement > 70 ? 1 : engagement / 100
    };

    // Update preference profile
    const prefKey = contentType;
    preferenceProfile.current[prefKey] = (typeof preferenceProfile.current[prefKey] === 'number' ? preferenceProfile.current[prefKey] as number : 0) + preference;

    // Store in database
    supabase
      .from('behavioral_analytics')
      .insert({
        user_id: user.id,
        session_id: sessionId,
        behavior_type: 'learning_style',
        behavior_data: behaviorData,
        context_metadata: {
          preferenceProfile: preferenceProfile.current as any,
          adaptiveAdjustments: []
        },
        pattern_indicators: {
          strongPreference: preference > 80,
          consistentEngagement: engagement > 70,
          learningEffectiveness: (engagement + preference) / 2
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error tracking learning style:', error);
      });

    console.log(`🎨 Learning style tracked: ${contentType} (engagement: ${engagement}%, preference: ${preference}%)`);
  }, [user?.id, sessionId]);

  // Track energy and fatigue levels
  const trackEnergyLevel = useCallback((level: number, indicators: Record<string, unknown>) => {
    if (!user?.id) return;

    const behaviorData = {
      energyLevel: level, // 0-100
      fatigueIndicators: indicators, // typing speed, click patterns, scroll behavior
      timeOfDay: new Date().getHours(),
      sessionDuration: Date.now() - lastActivity.current
    };

    // Store in database
    supabase
      .from('behavioral_analytics')
      .insert({
        user_id: user.id,
        session_id: sessionId,
        behavior_type: 'energy_level',
        behavior_data: behaviorData,
        context_metadata: indicators as any,
        pattern_indicators: {
          lowEnergy: level < 30,
          optimal: level > 70,
          declining: level < energyLevel.current - 10,
          needsBreak: level < 40
        }
      })
      .then(({ error }) => {
        if (error) console.error('Error tracking energy level:', error);
      });

    energyLevel.current = level;

    // Publish energy change event
    analyticsEventBus.publish({
      userId: user.id,
      eventType: 'energy_level_changed',
      metadata: {
        sessionId,
        energyLevel: level,
        indicators,
        needsIntervention: level < 40
      },
      source: 'behavioral_analytics'
    });

    console.log(`⚡ Energy level tracked: ${level}%`);
  }, [user?.id, sessionId]);

  // Detect behavioral patterns automatically
  const detectPatterns = useCallback(async () => {
    if (!user?.id) return null;

    try {
      // Get recent behavioral data
      const { data: recentBehavior } = await supabase
        .from('behavioral_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('timestamp', { ascending: false })
        .limit(100);

      if (!recentBehavior) return null;

      // Analyze patterns
      const patterns = {
        attentionSpan: calculateAverageAttentionSpan(recentBehavior),
        preferredLearningStyle: detectPreferredLearningStyle(recentBehavior),
        optimalStudyTime: detectOptimalStudyTime(recentBehavior),
        selfRegulationEffectiveness: calculateSelfRegulationEffectiveness(recentBehavior),
        energyPatterns: analyzeEnergyPatterns(recentBehavior)
      };

      return patterns;
    } catch (error) {
      console.error('Error detecting patterns:', error);
      return null;
    }
  }, [user?.id]);

  // Helper functions for pattern analysis
  const calculateAverageAttentionSpan = (data: BehavioralRecord[]): number => {
    const attentionData = data.filter(d => d.behavior_type === 'attention_pattern');
    if (attentionData.length === 0) return 0;
    
    const totalDuration = attentionData.reduce((sum, d) => sum + (d.behavior_data?.durationSeconds || 0), 0);
    return totalDuration / attentionData.length;
  };

  const detectPreferredLearningStyle = (data: BehavioralRecord[]): string => {
    const styleData = data.filter(d => d.behavior_type === 'learning_style');
    const preferences: Record<string, number> = {};

    styleData.forEach(d => {
      const contentType = d.behavior_data?.contentType;
      const preference = d.behavior_data?.preferenceRating || 0;
      preferences[contentType] = (preferences[contentType] || 0) + preference;
    });

    return Object.entries(preferences).sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';
  };

  const detectOptimalStudyTime = (data: BehavioralRecord[]): string => {
    const energyData = data.filter(d => d.behavior_type === 'energy_level');
    const hourlyEnergy: Record<number, number[]> = {};

    energyData.forEach(d => {
      const hour = new Date(d.timestamp).getHours();
      const energy = d.behavior_data?.energyLevel || 0;
      if (!hourlyEnergy[hour]) hourlyEnergy[hour] = [];
      hourlyEnergy[hour].push(energy);
    });

    const avgHourlyEnergy = Object.entries(hourlyEnergy).map(([hour, energies]) => [
      parseInt(hour),
      energies.reduce((a, b) => a + b, 0) / energies.length
    ]).sort(([,a], [,b]) => b - a);

    const optimalHour = avgHourlyEnergy[0]?.[0];
    if (optimalHour >= 6 && optimalHour < 12) return 'morning';
    if (optimalHour >= 12 && optimalHour < 18) return 'afternoon';
    if (optimalHour >= 18 && optimalHour < 22) return 'evening';
    return 'night';
  };

  const calculateSelfRegulationEffectiveness = (data: BehavioralRecord[]): number => {
    const selfRegData = data.filter(d => d.behavior_type === 'self_regulation');
    if (selfRegData.length === 0) return 0;

    const totalEffectiveness = selfRegData.reduce((sum, d) => sum + (d.behavior_data?.effectiveness || 0), 0);
    return totalEffectiveness / selfRegData.length;
  };

  const analyzeEnergyPatterns = (data: BehavioralRecord[]): Record<string, unknown> => {
    const energyData = data.filter(d => d.behavior_type === 'energy_level');
    if (energyData.length === 0) return {};

    const energyLevels = energyData.map(d => d.behavior_data?.energyLevel || 0);
    const avgEnergy = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;
    const variance = energyLevels.reduce((sum, level) => sum + Math.pow(level - avgEnergy, 2), 0) / energyLevels.length;

    return {
      averageEnergy: avgEnergy,
      energyVariability: Math.sqrt(variance),
      consistentHighEnergy: energyLevels.filter(l => l > 70).length / energyLevels.length,
      fatigueEpisodes: energyLevels.filter(l => l < 40).length
    };
  };

  // Update activity timestamp
  useEffect(() => {
    const updateActivity = () => {
      lastActivity.current = Date.now();
    };

    document.addEventListener('click', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('scroll', updateActivity);

    return () => {
      document.removeEventListener('click', updateActivity);
      document.removeEventListener('keydown', updateActivity);
      document.removeEventListener('scroll', updateActivity);
    };
  }, []);

  return {
    trackAttentionPattern,
    trackSelfRegulation,
    trackLearningStyle,
    trackEnergyLevel,
    detectPatterns,
    currentEnergyLevel: energyLevel.current,
    currentFocusLevel: focusLevel.current
  };
};