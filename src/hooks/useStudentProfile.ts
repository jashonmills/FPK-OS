import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Advanced Student Modeling Hook - Phase 3 Implementation
interface KnowledgeState {
  currentUnderstanding: number;
  confidence: number;
  misconceptions: string[];
  gapsIdentified: string[];
  masteredConcepts: string[];
}

interface CognitiveLoad {
  currentLoad: number;
  fatigueIndicators: string[];
  optimalChallenge: number;
  attentionSpan: number;
}

interface LearningStyle {
  preferredModality: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  questioningPreference: 'direct' | 'analogical' | 'systematic' | 'exploratory';
  scaffoldingNeeds: 'high' | 'medium' | 'low';
  pacePreference: 'slow' | 'moderate' | 'fast';
}

interface AdaptiveMetrics {
  responseTime: number[];
  questionTypes: string[];
  successfulStrategies: string[];
  strugglingAreas: string[];
}

interface StudentProfile {
  id?: string;
  user_id: string;
  knowledge_state: KnowledgeState;
  cognitive_load: CognitiveLoad;
  learning_style: LearningStyle;
  adaptive_metrics: AdaptiveMetrics;
  created_at?: string;
  updated_at?: string;
}

export const useStudentProfile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load student profile
  const loadProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setProfile(data as unknown as StudentProfile);
      } else {
        // Initialize new profile
        await initializeProfile();
      }
    } catch (error) {
      console.error('Error loading student profile:', error);
      toast({
        title: "Profile loading error",
        description: "There was a problem loading your learning profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize new student profile
  const initializeProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .insert({
          user_id: user.id,
          knowledge_state: {
            currentUnderstanding: 0.5,
            confidence: 0.5,
            misconceptions: [],
            gapsIdentified: [],
            masteredConcepts: []
          },
          cognitive_load: {
            currentLoad: 0.4,
            fatigueIndicators: [],
            optimalChallenge: 0.6,
            attentionSpan: 15
          },
          learning_style: {
            preferredModality: 'mixed',
            questioningPreference: 'exploratory',
            scaffoldingNeeds: 'medium',
            pacePreference: 'moderate'
          },
          adaptive_metrics: {
            responseTime: [],
            questionTypes: [],
            successfulStrategies: [],
            strugglingAreas: []
          }
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data as unknown as StudentProfile);
      
      toast({
        title: "Learning Profile Created",
        description: "Your personalized learning profile has been initialized!",
      });
    } catch (error) {
      console.error('Error initializing student profile:', error);
    }
  };

  // Update understanding level based on interaction
  const updateUnderstanding = async (topic: string, comprehensionLevel: number, confidence: number) => {
    if (!profile || !user?.id) return;

    setIsUpdating(true);
    try {
      const updatedKnowledge = {
        ...profile.knowledge_state,
        currentUnderstanding: Math.max(0, Math.min(1, comprehensionLevel)),
        confidence: Math.max(0, Math.min(1, confidence))
      };

      // Add to mastered concepts if understanding is high
      if (comprehensionLevel > 0.8 && !updatedKnowledge.masteredConcepts.includes(topic)) {
        updatedKnowledge.masteredConcepts.push(topic);
      }

      // Add to gaps if understanding is low
      if (comprehensionLevel < 0.4 && !updatedKnowledge.gapsIdentified.includes(topic)) {
        updatedKnowledge.gapsIdentified.push(topic);
      }

      const { data, error } = await supabase
        .from('student_profiles')
        .update({
          knowledge_state: updatedKnowledge,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as unknown as StudentProfile);
    } catch (error) {
      console.error('Error updating understanding:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update cognitive load based on response patterns
  const updateCognitiveLoad = async (responseTime: number, difficultyLevel: number) => {
    if (!profile || !user?.id) return;

    try {
      const updatedLoad = {
        ...profile.cognitive_load,
        currentLoad: Math.max(0, Math.min(1, difficultyLevel * 0.2)), // Simple heuristic
      };

      // Add response time to metrics
      const updatedMetrics = {
        ...profile.adaptive_metrics,
        responseTime: [...profile.adaptive_metrics.responseTime.slice(-9), responseTime] // Keep last 10
      };

      const { data, error } = await supabase
        .from('student_profiles')
        .update({
          cognitive_load: updatedLoad,
          adaptive_metrics: updatedMetrics,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as unknown as StudentProfile);
    } catch (error) {
      console.error('Error updating cognitive load:', error);
    }
  };

  // Track successful teaching strategy
  const trackSuccessfulStrategy = async (strategy: string, questionType: string) => {
    if (!profile || !user?.id) return;

    try {
      const updatedMetrics = {
        ...profile.adaptive_metrics,
        successfulStrategies: [
          ...new Set([...profile.adaptive_metrics.successfulStrategies, strategy])
        ].slice(-10), // Keep unique, last 10
        questionTypes: [
          ...profile.adaptive_metrics.questionTypes.slice(-9), 
          questionType
        ] // Keep last 10
      };

      const { data, error } = await supabase
        .from('student_profiles')
        .update({
          adaptive_metrics: updatedMetrics,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as unknown as StudentProfile);
    } catch (error) {
      console.error('Error tracking successful strategy:', error);
    }
  };

  // Add identified misconception
  const addMisconception = async (misconception: string) => {
    if (!profile || !user?.id) return;

    try {
      const updatedKnowledge = {
        ...profile.knowledge_state,
        misconceptions: [
          ...new Set([...profile.knowledge_state.misconceptions, misconception])
        ].slice(-5) // Keep unique, last 5
      };

      const { data, error } = await supabase
        .from('student_profiles')
        .update({
          knowledge_state: updatedKnowledge,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as unknown as StudentProfile);
    } catch (error) {
      console.error('Error adding misconception:', error);
    }
  };

  // Update learning style preferences
  const updateLearningStyle = async (updates: Partial<LearningStyle>) => {
    if (!profile || !user?.id) return;

    setIsUpdating(true);
    try {
      const updatedStyle = {
        ...profile.learning_style,
        ...updates
      };

      const { data, error } = await supabase
        .from('student_profiles')
        .update({
          learning_style: updatedStyle,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as unknown as StudentProfile);
      
      toast({
        title: "Learning Style Updated",
        description: "Your learning preferences have been updated to better personalize your experience.",
      });
    } catch (error) {
      console.error('Error updating learning style:', error);
      toast({
        title: "Update Error",
        description: "There was a problem updating your learning style.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Get learning recommendations based on profile
  const getLearningRecommendations = () => {
    if (!profile) return [];

    const recommendations = [];
    const { knowledge_state, cognitive_load, learning_style } = profile;

    // Knowledge-based recommendations
    if (knowledge_state.currentUnderstanding < 0.5) {
      recommendations.push({
        type: 'scaffolding',
        message: 'Let\'s focus on building foundational understanding with more guided questions.',
        priority: 'high'
      });
    }

    if (knowledge_state.confidence < 0.4) {
      recommendations.push({
        type: 'confidence',
        message: 'Try starting with easier concepts to build confidence.',
        priority: 'medium'
      });
    }

    // Cognitive load recommendations
    if (cognitive_load.currentLoad > 0.7) {
      recommendations.push({
        type: 'cognitive_load',
        message: 'Consider taking a break or working on simpler problems.',
        priority: 'high'
      });
    }

    // Learning style recommendations
    if (learning_style.scaffoldingNeeds === 'high') {
      recommendations.push({
        type: 'scaffolding',
        message: 'I\'ll provide more step-by-step guidance and examples.',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  return {
    profile,
    isLoading,
    isUpdating,
    updateUnderstanding,
    updateCognitiveLoad,
    trackSuccessfulStrategy,
    addMisconception,
    updateLearningStyle,
    getLearningRecommendations,
    refreshProfile: loadProfile
  };
};