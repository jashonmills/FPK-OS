import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

interface LearningProfile {
  preferredContentTypes: string[];
  optimalDifficulty: number;
  attentionSpan: number;
  learningVelocity: number;
  strengths: string[];
  challenges: string[];
  adaptations: Record<string, unknown>;
  [key: string]: unknown; // Add index signature for Json compatibility
}

interface AdaptiveRecommendation {
  type: 'content_adjustment' | 'difficulty_change' | 'format_change' | 'break_suggestion' | 'path_change';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionData: Record<string, unknown>;
  expectedImpact: string;
  confidence: number;
}

export const useAdaptiveLearning = () => {
  const { user } = useAuth();
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [adaptationHistory, setAdaptationHistory] = useState<Array<{
    recommendation: AdaptiveRecommendation;
    appliedAt: string;
    effectiveness?: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  // Load user's learning profile
  const loadLearningProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get stored learning profile
      const { data: storedProfile } = await supabase
        .from('adaptive_learning_paths')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (storedProfile) {
        setLearningProfile(storedProfile.learning_profile as LearningProfile);
      } else {
        // Generate initial profile from behavioral data
        const generatedProfile = await generateLearningProfile();
        setLearningProfile(generatedProfile);
      }
    } catch (error) {
      console.error('Error loading learning profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Generate learning profile from behavioral analytics
  const generateLearningProfile = useCallback(async (): Promise<LearningProfile> => {
    if (!user?.id) {
      return getDefaultProfile();
    }

    try {
      // Get behavioral data from last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: behavioralData } = await supabase
        .from('behavioral_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', thirtyDaysAgo);

      const { data: slideData } = await supabase
        .from('slide_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', thirtyDaysAgo);

      const { data: progressData } = await supabase
        .from('lesson_progress_detailed')
        .select('*')
        .eq('user_id', user.id)
        .gte('updated_at', thirtyDaysAgo);

      // Analyze data to create profile
      const profile = analyzeUserData(behavioralData || [], slideData || [], progressData || []);
      
      // Store the generated profile
      await supabase
        .from('adaptive_learning_paths')
        .upsert({
          user_id: user.id,
          learning_profile: profile as unknown as Json,
          effectiveness_score: 0, // Will be updated as user interacts
        });

      return profile;
    } catch (error) {
      console.error('Error generating learning profile:', error);
      return getDefaultProfile();
    }
  }, [user?.id]);

  // Analyze user data to create learning profile  
  const analyzeUserData = (behavioral: Record<string, unknown>[], slides: Record<string, unknown>[], progress: Record<string, unknown>[]): LearningProfile => {
    // Analyze learning style preferences
    const stylePreferences = analyzeLearningStyles(behavioral);
    
    // Analyze attention patterns
    const attentionData = analyzeAttentionPatterns(behavioral, slides);
    
    // Analyze learning velocity
    const velocityData = analyzeLearningVelocity(progress);
    
    // Analyze difficulty preferences
    const difficultyData = analyzeDifficultyPreferences(progress, slides);
    
    // Identify strengths and challenges
    const strengthsAndChallenges = identifyStrengthsAndChallenges(progress, behavioral);

    return {
      preferredContentTypes: stylePreferences,
      optimalDifficulty: difficultyData.optimal,
      attentionSpan: attentionData.average,
      learningVelocity: velocityData.average,
      strengths: strengthsAndChallenges.strengths,
      challenges: strengthsAndChallenges.challenges,
      adaptations: {
        contentFormat: getBestContentFormat(stylePreferences),
        sessionLength: getOptimalSessionLength(attentionData.average),
        difficultyProgression: getDifficultyProgression(difficultyData),
        breakFrequency: getOptimalBreakFrequency(attentionData.variance)
      }
    };
  };

  // Generate AI-powered adaptive recommendations
  const generateRecommendations = useCallback(async (currentContext: Record<string, any>) => {
    if (!user?.id || !learningProfile) return;

    try {
      // Get recent performance data
      const recentData = await getRecentPerformanceData();
      
      // Analyze current learning state
      const currentState = await analyzeLearningState(recentData, currentContext);
      
      // Generate recommendations based on profile and current state
      const newRecommendations = await generateContextualRecommendations(
        learningProfile, 
        currentState, 
        currentContext
      );

      setRecommendations(newRecommendations);

      // Store recommendations in database
      for (const rec of newRecommendations) {
        await supabase
          .from('ai_recommendations')
          .insert({
            user_id: user.id,
            recommendation_type: rec.type,
            recommendation_data: {
              title: rec.title,
              description: rec.description,
              actionData: rec.actionData as unknown as Json,
              expectedImpact: rec.expectedImpact,
              confidence: rec.confidence,
              priority: rec.priority
            } as Json,
            trigger_context: currentContext as unknown as Json,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
          });
      }

      console.log(`🤖 Generated ${newRecommendations.length} adaptive recommendations`);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  }, [user?.id, learningProfile]);

  // Apply adaptive recommendation
  const applyRecommendation = useCallback(async (recommendation: AdaptiveRecommendation, effectiveness?: number) => {
    if (!user?.id) return;

    try {
      // Mark recommendation as applied
      await supabase
        .from('ai_recommendations')
        .update({
          applied_at: new Date().toISOString(),
          effectiveness_rating: effectiveness
        })
        .eq('user_id', user.id)
        .eq('recommendation_type', recommendation.type);

      // Update learning profile based on effectiveness
      if (effectiveness && learningProfile) {
        const updatedProfile = updateProfileFromFeedback(learningProfile, recommendation, effectiveness);
        setLearningProfile(updatedProfile);
        
        await supabase
          .from('adaptive_learning_paths')
          .update({ 
            learning_profile: updatedProfile as unknown as Json,
            effectiveness_score: calculateEffectivenessScore(adaptationHistory)
          })
          .eq('user_id', user.id);
      }

      // Add to adaptation history
      const adaptationEntry = {
        recommendation,
        appliedAt: new Date().toISOString(),
        effectiveness
      };
      
      setAdaptationHistory(prev => [adaptationEntry, ...prev]);

      console.log(`✅ Applied recommendation: ${recommendation.title}`);
    } catch (error) {
      console.error('Error applying recommendation:', error);
    }
  }, [user?.id, learningProfile, adaptationHistory]);

  // Update learning profile based on real-time performance
  const updateProfileFromPerformance = useCallback(async (performanceData: Record<string, any>) => {
    if (!learningProfile || !user?.id) return;

    const updatedProfile = { ...learningProfile };
    
    // Update based on performance indicators
    if (performanceData.attentionScore < 60) {
      updatedProfile.attentionSpan = Math.max(300, updatedProfile.attentionSpan - 30); // Reduce by 30s
    } else if (performanceData.attentionScore > 80) {
      updatedProfile.attentionSpan = Math.min(1800, updatedProfile.attentionSpan + 30); // Increase by 30s
    }

    if (performanceData.cognitiveLoad > 70) {
      updatedProfile.optimalDifficulty = Math.max(1, updatedProfile.optimalDifficulty - 0.1);
    } else if (performanceData.cognitiveLoad < 30) {
      updatedProfile.optimalDifficulty = Math.min(10, updatedProfile.optimalDifficulty + 0.1);
    }

    // Update adaptations
    updatedProfile.adaptations = {
      ...updatedProfile.adaptations,
      sessionLength: getOptimalSessionLength(updatedProfile.attentionSpan),
      breakFrequency: getOptimalBreakFrequency(performanceData.cognitiveLoad)
    };

    setLearningProfile(updatedProfile);

    // Store updated profile
    await supabase
      .from('adaptive_learning_paths')
      .update({ learning_profile: updatedProfile as unknown as Json })
      .eq('user_id', user.id);

    console.log('📊 Learning profile updated from performance data');
  }, [learningProfile, user?.id]);

  // Helper functions
  const getDefaultProfile = (): LearningProfile => ({
    preferredContentTypes: ['visual', 'interactive'],
    optimalDifficulty: 5,
    attentionSpan: 900, // 15 minutes
    learningVelocity: 1.0,
    strengths: [],
    challenges: [],
    adaptations: {
      contentFormat: 'mixed',
      sessionLength: 'medium',
      difficultyProgression: 'gradual',
      breakFrequency: 'regular'
    }
  });

  const analyzeLearningStyles = (behavioral: Record<string, unknown>[]): string[] => {
    const styleData = behavioral.filter(d => d.behavior_type === 'learning_style');
    const preferences: Record<string, number> = {};
    
    styleData.forEach(d => {
      const behaviorData = d.behavior_data as Record<string, unknown> | undefined;
      const contentType = behaviorData?.contentType as string;
      const preference = (behaviorData?.preferenceRating as number) || 0;
      if (contentType) {
        preferences[contentType] = (preferences[contentType] || 0) + preference;
      }
    });

    return Object.entries(preferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([style]) => style);
  };

  const analyzeAttentionPatterns = (behavioral: Record<string, unknown>[], slides: Record<string, unknown>[]) => {
    const attentionData = [
      ...behavioral.filter(d => d.behavior_type === 'attention_pattern'),
      ...slides.filter(d => d.event_type === 'view_end')
    ];

    if (attentionData.length === 0) return { average: 900, variance: 0 };

    const durations = attentionData.map(d => {
      const behaviorData = d.behavior_data as Record<string, unknown> | undefined;
      return (behaviorData?.durationSeconds as number) || (d.duration_seconds as number) || 0;
    });
    const average = durations.reduce((a, b) => a + b, 0) / durations.length;
    const variance = durations.reduce((sum, dur) => sum + Math.pow(dur - average, 2), 0) / durations.length;

    return { average, variance };
  };

  const analyzeLearningVelocity = (progress: Record<string, unknown>[]) => {
    if (progress.length === 0) return { average: 1.0 };

    const velocities = progress.map(p => (p.learning_velocity as number) || 1.0);
    const average = velocities.reduce((a, b) => a + b, 0) / velocities.length;

    return { average };
  };

  const analyzeDifficultyPreferences = (progress: Record<string, unknown>[], slides: Record<string, unknown>[]) => {
    // Analyze relationship between difficulty and performance
    const combinedData = progress.map(p => {
      const completionQuality = p.completion_quality as Record<string, unknown> | undefined;
      return {
        difficulty: (p.difficulty_perception as number) || 5,
        performance: (completionQuality?.overallQuality as number) || 0.5
      };
    });

    if (combinedData.length === 0) return { optimal: 5 };

    // Find difficulty level with best performance
    const difficultyGroups: Record<number, number[]> = {};
    combinedData.forEach(d => {
      const diffLevel = Math.round(d.difficulty);
      if (!difficultyGroups[diffLevel]) difficultyGroups[diffLevel] = [];
      difficultyGroups[diffLevel].push(d.performance);
    });

    let bestDifficulty = 5;
    let bestPerformance = 0;

    Object.entries(difficultyGroups).forEach(([diff, performances]) => {
      const avgPerformance = performances.reduce((a, b) => a + b, 0) / performances.length;
      if (avgPerformance > bestPerformance) {
        bestPerformance = avgPerformance;
        bestDifficulty = parseInt(diff);
      }
    });

    return { optimal: bestDifficulty };
  };

  const identifyStrengthsAndChallenges = (progress: Record<string, unknown>[], behavioral: Record<string, unknown>[]) => {
    const strengths: string[] = [];
    const challenges: string[] = [];

    // Analyze completion rates by content type
    const completionRates: Record<string, number[]> = {};
    progress.forEach(p => {
      const metadata = p.metadata as Record<string, unknown> | undefined;
      const contentType = (metadata?.contentType as string) || 'general';
      if (!completionRates[contentType]) completionRates[contentType] = [];
      completionRates[contentType].push(((p.progress_percentage as number) || 0) / 100);
    });

    Object.entries(completionRates).forEach(([contentType, rates]) => {
      const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
      if (avgRate > 0.8) strengths.push(contentType);
      if (avgRate < 0.5) challenges.push(contentType);
    });

    return { strengths, challenges };
  };

  const getBestContentFormat = (preferences: string[]): string => {
    if (preferences.includes('visual') && preferences.includes('interactive')) return 'mixed_interactive';
    if (preferences.includes('visual')) return 'visual_heavy';
    if (preferences.includes('auditory')) return 'audio_enhanced';
    return 'balanced';
  };

  const getOptimalSessionLength = (attentionSpan: number): string => {
    if (attentionSpan < 600) return 'short'; // < 10 minutes
    if (attentionSpan < 1200) return 'medium'; // < 20 minutes
    return 'long'; // 20+ minutes
  };

  const getDifficultyProgression = (difficultyData: { optimal: number }): string => {
    return difficultyData.optimal > 7 ? 'aggressive' : difficultyData.optimal < 4 ? 'gentle' : 'gradual';
  };

  const getOptimalBreakFrequency = (variance: number): string => {
    if (variance > 200) return 'frequent'; // High variance suggests need for more breaks
    if (variance < 50) return 'minimal'; // Low variance suggests sustained attention
    return 'regular';
  };

  // Load learning profile on mount
  useEffect(() => {
    loadLearningProfile();
  }, [loadLearningProfile]);

  return {
    learningProfile,
    recommendations,
    adaptationHistory,
    loading,
    generateRecommendations,
    applyRecommendation,
    updateProfileFromPerformance,
    loadLearningProfile
  };
}

// Helper functions for recommendation generation (would be expanded with AI logic)
async function getRecentPerformanceData() {
  // Implementation would fetch recent performance metrics
  return {};
}

async function analyzeLearningState(recentData: Record<string, unknown>, context: Record<string, unknown>) {
  // Implementation would analyze current learning state
  return {};
}

async function generateContextualRecommendations(
  profile: LearningProfile, 
  state: Record<string, unknown>, 
  context: Record<string, unknown>
): Promise<AdaptiveRecommendation[]> {
  // Implementation would use AI to generate personalized recommendations
  return [];
}

function updateProfileFromFeedback(
  profile: LearningProfile, 
  recommendation: AdaptiveRecommendation, 
  effectiveness: number
): LearningProfile {
  // Implementation would update profile based on recommendation effectiveness
  return profile;
}

function calculateEffectivenessScore(history: Array<{ effectiveness?: number }>): number {
  if (history.length === 0) return 0;
  
  const totalEffectiveness = history
    .filter(h => h.effectiveness)
    .reduce((sum, h) => sum + h.effectiveness, 0);
  
  return totalEffectiveness / history.length;
}