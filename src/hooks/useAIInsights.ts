
import { useState, useEffect } from 'react';
import { aiInsightsEngine, LearningInsight, AnomalyAlert } from '@/services/AIInsightsEngine';

export const useAIInsights = () => {
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = () => {
      try {
        const recentInsights = aiInsightsEngine.getRecentInsights(20);
        const activeAnomalies = aiInsightsEngine.getActiveAnomalies();
        
        setInsights(recentInsights);
        setAnomalies(activeAnomalies);
      } catch (error) {
        console.error('Error loading AI insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load initial data
    loadInsights();

    // Refresh insights periodically
    const interval = setInterval(loadInsights, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const resolveAnomaly = async (anomalyId: string) => {
    try {
      await aiInsightsEngine.resolveAnomaly(anomalyId);
      setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
    } catch (error) {
      console.error('Error resolving anomaly:', error);
    }
  };

  return {
    insights,
    anomalies,
    isLoading,
    resolveAnomaly
  };
};
