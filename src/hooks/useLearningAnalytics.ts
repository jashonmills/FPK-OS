import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Advanced Learning Analytics Hook - Phase 4 Implementation
interface AnalyticsEvent {
  id?: string;
  user_id: string;
  session_id: string;
  interaction_type: 'question_asked' | 'answer_given' | 'misconception_corrected' | 'concept_mastered' | 'scaffold_provided';
  topic: string;
  difficulty_level: number;
  success_rate: number;
  time_spent_seconds: number;
  cognitive_load_estimate: number;
  engagement_score: number;
  metadata: Record<string, any>;
  created_at?: string;
}

interface LearningTrends {
  understanding_trend: number[];
  engagement_trend: number[];
  difficulty_progression: number[];
  topic_mastery: Record<string, number>;
  time_analysis: {
    average_session_time: number;
    peak_learning_hours: number[];
    consistency_score: number;
  };
}

interface PerformanceMetrics {
  current_session: {
    questions_answered: number;
    concepts_explored: number;
    misconceptions_addressed: number;
    scaffolding_provided: number;
    engagement_score: number;
  };
  overall: {
    total_sessions: number;
    average_understanding: number;
    improvement_rate: number;
    mastered_topics: string[];
    struggling_areas: string[];
  };
}

export const useLearningAnalytics = (sessionId: string | null) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [trends, setTrends] = useState<LearningTrends | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Log learning interaction
  const logInteraction = async (
    interactionType: AnalyticsEvent['interaction_type'],
    topic: string,
    difficultyLevel: number,
    successRate: number,
    timeSpentSeconds: number,
    cognitiveLoadEstimate: number,
    engagementScore: number,
    metadata: Record<string, any> = {}
  ) => {
    if (!user?.id || !sessionId) return;

    try {
      const { data, error } = await supabase
        .from('learning_analytics')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          interaction_type: interactionType,
          topic,
          difficulty_level: difficultyLevel,
          success_rate: successRate,
          time_spent_seconds: timeSpentSeconds,
          cognitive_load_estimate: cognitiveLoadEstimate,
          engagement_score: engagementScore,
          metadata
        })
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data as AnalyticsEvent]);
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  // Load analytics data
  const loadAnalytics = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Load recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('learning_analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) throw eventsError;
      setEvents((eventsData || []) as AnalyticsEvent[]);

      // Calculate trends and metrics
      if (eventsData && eventsData.length > 0) {
        calculateTrends(eventsData as AnalyticsEvent[]);
        calculateMetrics(eventsData as AnalyticsEvent[]);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate learning trends
  const calculateTrends = (eventsData: AnalyticsEvent[]) => {
    const sortedEvents = [...eventsData].sort((a, b) => 
      new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
    );

    const understandingTrend = sortedEvents
      .filter(e => e.interaction_type === 'answer_given')
      .map(e => e.success_rate)
      .slice(-20); // Last 20 interactions

    const engagementTrend = sortedEvents
      .map(e => e.engagement_score)
      .slice(-20);

    const difficultyProgression = sortedEvents
      .map(e => e.difficulty_level)
      .slice(-20);

    // Topic mastery calculation
    const topicMastery: Record<string, number[]> = {};
    sortedEvents.forEach(event => {
      if (!topicMastery[event.topic]) {
        topicMastery[event.topic] = [];
      }
      topicMastery[event.topic].push(event.success_rate);
    });

    // Calculate average mastery for each topic
    const finalTopicMastery: Record<string, number> = {};
    Object.keys(topicMastery).forEach(topic => {
      const scores = topicMastery[topic];
      finalTopicMastery[topic] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    // Time analysis
    const sessionTimes = groupBy(sortedEvents, 'session_id');
    const sessionDurations = Object.values(sessionTimes).map(sessionEvents => 
      sessionEvents.reduce((total, event) => total + event.time_spent_seconds, 0)
    );

    const averageSessionTime = sessionDurations.length > 0 
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
      : 0;

    // Peak learning hours analysis
    const hourCounts: Record<number, number> = {};
    sortedEvents.forEach(event => {
      const hour = new Date(event.created_at!).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakLearningHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Consistency score (sessions per week over last month)
    const now = new Date();
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentSessions = Object.keys(sessionTimes).filter(sessionId => {
      const sessionEvents = sessionTimes[sessionId];
      return sessionEvents.some(event => new Date(event.created_at!) > lastMonth);
    });

    const consistencyScore = Math.min(1, recentSessions.length / 20); // 20 sessions in a month = perfect consistency

    setTrends({
      understanding_trend: understandingTrend,
      engagement_trend: engagementTrend,
      difficulty_progression: difficultyProgression,
      topic_mastery: finalTopicMastery,
      time_analysis: {
        average_session_time: averageSessionTime,
        peak_learning_hours: peakLearningHours,
        consistency_score: consistencyScore
      }
    });
  };

  // Calculate performance metrics
  const calculateMetrics = (eventsData: AnalyticsEvent[]) => {
    const currentSessionEvents = eventsData.filter(e => e.session_id === sessionId);
    const allSessions = groupBy(eventsData, 'session_id');

    // Current session metrics
    const currentSession = {
      questions_answered: currentSessionEvents.filter(e => e.interaction_type === 'answer_given').length,
      concepts_explored: new Set(currentSessionEvents.map(e => e.topic)).size,
      misconceptions_addressed: currentSessionEvents.filter(e => e.interaction_type === 'misconception_corrected').length,
      scaffolding_provided: currentSessionEvents.filter(e => e.interaction_type === 'scaffold_provided').length,
      engagement_score: currentSessionEvents.length > 0 
        ? currentSessionEvents.reduce((sum, e) => sum + e.engagement_score, 0) / currentSessionEvents.length
        : 0
    };

    // Overall metrics
    const allAnswerEvents = eventsData.filter(e => e.interaction_type === 'answer_given');
    const averageUnderstanding = allAnswerEvents.length > 0
      ? allAnswerEvents.reduce((sum, e) => sum + e.success_rate, 0) / allAnswerEvents.length
      : 0;

    // Improvement rate (comparing first 10 vs last 10 interactions)
    const firstTen = allAnswerEvents.slice(0, 10);
    const lastTen = allAnswerEvents.slice(-10);
    const improvementRate = firstTen.length > 0 && lastTen.length > 0
      ? (lastTen.reduce((sum, e) => sum + e.success_rate, 0) / lastTen.length) -
        (firstTen.reduce((sum, e) => sum + e.success_rate, 0) / firstTen.length)
      : 0;

    // Mastered topics (>80% success rate)
    const topicPerformance: Record<string, number[]> = {};
    allAnswerEvents.forEach(event => {
      if (!topicPerformance[event.topic]) {
        topicPerformance[event.topic] = [];
      }
      topicPerformance[event.topic].push(event.success_rate);
    });

    const masteredTopics = Object.entries(topicPerformance)
      .filter(([, scores]) => scores.reduce((sum, score) => sum + score, 0) / scores.length > 0.8)
      .map(([topic]) => topic);

    const strugglingAreas = Object.entries(topicPerformance)
      .filter(([, scores]) => scores.reduce((sum, score) => sum + score, 0) / scores.length < 0.5)
      .map(([topic]) => topic);

    setMetrics({
      current_session: currentSession,
      overall: {
        total_sessions: Object.keys(allSessions).length,
        average_understanding: averageUnderstanding,
        improvement_rate: improvementRate,
        mastered_topics: masteredTopics,
        struggling_areas: strugglingAreas
      }
    });
  };

  // Quick logging functions for common interactions
  const logQuestionAsked = (topic: string, difficulty: number, metadata: Record<string, any> = {}) => {
    return logInteraction('question_asked', topic, difficulty, 1, 0, 0.3, 0.8, metadata);
  };

  const logAnswerGiven = (topic: string, success_rate: number, time_seconds: number, difficulty: number, metadata: Record<string, any> = {}) => {
    return logInteraction('answer_given', topic, difficulty, success_rate, time_seconds, 0.5, 0.7, metadata);
  };

  const logMisconceptionCorrected = (topic: string, metadata: Record<string, any> = {}) => {
    return logInteraction('misconception_corrected', topic, 3, 1, 0, 0.6, 0.9, metadata);
  };

  const logConceptMastered = (topic: string, metadata: Record<string, any> = {}) => {
    return logInteraction('concept_mastered', topic, 4, 1, 0, 0.4, 1, metadata);
  };

  const logScaffoldProvided = (topic: string, difficulty: number, metadata: Record<string, any> = {}) => {
    return logInteraction('scaffold_provided', topic, difficulty, 1, 0, 0.7, 0.8, metadata);
  };

  // Get learning insights
  const getLearningInsights = () => {
    if (!trends || !metrics) return [];

    const insights = [];

    // Understanding trend analysis
    if (trends.understanding_trend.length >= 5) {
      const recent = trends.understanding_trend.slice(-5);
      const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
      
      if (average > 0.8) {
        insights.push({
          type: 'positive',
          title: 'Excellent Understanding',
          message: 'You\'re demonstrating strong comprehension across topics!',
          priority: 'high'
        });
      } else if (average < 0.5) {
        insights.push({
          type: 'concern',
          title: 'Understanding Needs Attention',
          message: 'Let\'s focus on building stronger foundations in key concepts.',
          priority: 'high'
        });
      }
    }

    // Engagement analysis
    if (trends.engagement_trend.length >= 3) {
      const recent = trends.engagement_trend.slice(-3);
      const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
      
      if (average < 0.6) {
        insights.push({
          type: 'engagement',
          title: 'Engagement Opportunity',
          message: 'Try exploring topics that interest you more or take short breaks.',
          priority: 'medium'
        });
      }
    }

    // Improvement analysis
    if (metrics.overall.improvement_rate > 0.2) {
      insights.push({
        type: 'positive',
        title: 'Great Progress!',
        message: `You've improved significantly! Keep up the excellent work.`,
        priority: 'medium'
      });
    }

    return insights;
  };

  // Utility function for grouping
  const groupBy = <T extends Record<string, any>>(array: T[], key: keyof T) => {
    return array.reduce((groups, item) => {
      const groupKey = item[key];
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  };

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id]);

  return {
    events,
    trends,
    metrics,
    isLoading,
    
    // Core logging
    logInteraction,
    
    // Quick logging functions
    logQuestionAsked,
    logAnswerGiven,
    logMisconceptionCorrected,
    logConceptMastered,
    logScaffoldProvided,
    
    // Analysis
    getLearningInsights,
    refreshAnalytics: loadAnalytics
  };
};