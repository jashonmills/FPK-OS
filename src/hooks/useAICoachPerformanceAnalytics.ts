import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalyticsEventBus } from '@/hooks/useAnalyticsEventBus';

interface PerformanceMetrics {
  averageResponseTime: number;
  errorRate: number;
  userSatisfactionScore: number;
  modeUsageDistribution: {
    personal: number;
    general: number;
  };
  peakUsageHours: number[];
  sessionCompletionRate: number;
}

interface ResponseTimeEntry {
  timestamp: number;
  responseTime: number;
  mode: 'personal' | 'general';
  success: boolean;
  errorType?: string;
}

export const useAICoachPerformanceAnalytics = () => {
  const { user } = useAuth();
  const { publishEvent, getEventsByType } = useAnalyticsEventBus();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [responseTimes, setResponseTimes] = useState<ResponseTimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track response time for AI chat interactions
  const trackResponseTime = useCallback((
    responseTime: number,
    mode: 'personal' | 'general',
    success: boolean = true,
    errorType?: string
  ) => {
    const entry: ResponseTimeEntry = {
      timestamp: Date.now(),
      responseTime,
      mode,
      success,
      errorType
    };

    setResponseTimes(prev => {
      const updated = [...prev, entry];
      // Keep only last 100 entries for performance
      return updated.slice(-100);
    });

    // Publish performance event
    publishEvent('ai_coach.performance.response_time', {
      responseTime,
      mode,
      success,
      errorType,
      timestamp: new Date().toISOString()
    });
  }, [publishEvent]);

  // Track user satisfaction rating
  const trackSatisfactionRating = useCallback((rating: number, sessionId?: string) => {
    publishEvent('ai_coach.satisfaction.rating', {
      rating,
      sessionId,
      timestamp: new Date().toISOString()
    });
  }, [publishEvent]);

  // Track mode switching behavior
  const trackModeSwitch = useCallback((fromMode: string, toMode: string, reason?: string) => {
    publishEvent('ai_coach.mode.switch', {
      fromMode,
      toMode,
      reason,
      timestamp: new Date().toISOString()
    });
  }, [publishEvent]);


  // Calculate performance metrics
  const calculateMetrics = useCallback(() => {
    if (responseTimes.length === 0) {
      return null;
    }

    const successfulResponses = responseTimes.filter(r => r.success);
    const totalResponses = responseTimes.length;

    // Average response time
    const averageResponseTime = successfulResponses.reduce((sum, r) => sum + r.responseTime, 0) / successfulResponses.length;

    // Error rate
    const errorRate = ((totalResponses - successfulResponses.length) / totalResponses) * 100;

    // Mode usage distribution
    const personalModeCount = responseTimes.filter(r => r.mode === 'personal').length;
    const generalModeCount = responseTimes.filter(r => r.mode === 'general').length;
    const totalModeUsage = personalModeCount + generalModeCount;

    const modeUsageDistribution = {
      personal: totalModeUsage > 0 ? (personalModeCount / totalModeUsage) * 100 : 0,
      general: totalModeUsage > 0 ? (generalModeCount / totalModeUsage) * 100 : 0
    };

    // Peak usage hours (simplified - would need more data in real implementation)
    const peakUsageHours = [9, 14, 19]; // 9am, 2pm, 7pm as defaults

    return {
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      errorRate: Math.round(errorRate),
      userSatisfactionScore: 4.2, // This would come from satisfaction ratings
      modeUsageDistribution,
      peakUsageHours,
      sessionCompletionRate: 85 // This would be calculated from session data
    };
  }, [responseTimes]);

  // Update metrics when response times change
  useEffect(() => {
    const newMetrics = calculateMetrics();
    setMetrics(newMetrics);
    setIsLoading(false);
  }, [responseTimes, calculateMetrics]);

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      // In a real implementation, we would load historical data here
      setIsLoading(false);
    }
  }, [user?.id]);

  // Get insights based on performance data
  const getPerformanceInsights = useCallback(() => {
    if (!metrics) return [];

    const insights = [];

    if (metrics.averageResponseTime > 3) {
      insights.push({
        type: 'warning',
        title: 'Slow Response Times',
        description: `Average response time is ${metrics.averageResponseTime}s. Consider optimizing queries.`,
        action: 'Try shorter, more specific questions for faster responses.'
      });
    }


    if (metrics.errorRate > 10) {
      insights.push({
        type: 'error',
        title: 'High Error Rate',
        description: `${metrics.errorRate}% of requests failed. Check your connection.`,
        action: 'Ensure stable internet connection and try again.'
      });
    }

    if (metrics.modeUsageDistribution.personal < 20) {
      insights.push({
        type: 'tip',
        title: 'Try Personal Mode',
        description: 'You\'re mostly using General mode. Personal mode provides tailored insights.',
        action: 'Switch to "My Data" mode for personalized study guidance.'
      });
    }

    return insights;
  }, [metrics]);

  return {
    metrics,
    responseTimes,
    isLoading,
    trackResponseTime,
    trackSatisfactionRating,
    trackModeSwitch,
    getPerformanceInsights
  };
};
