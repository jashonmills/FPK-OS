
import { useState, useEffect } from 'react';
import { featureFlagService } from '@/services/FeatureFlagService';

export interface AnalyticsCardConfig {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  featureFlag?: string;
  order: number;
  enabled: boolean;
  props?: Record<string, any>;
}

export const useAnalyticsCards = () => {
  const [cards, setCards] = useState<AnalyticsCardConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load analytics cards configuration
    const loadCards = async () => {
      try {
        // This would normally come from a database or config service
        // For now, we'll define them here
        const cardConfigs: AnalyticsCardConfig[] = [
          {
            id: 'reading-analytics',
            title: 'Reading Analytics',
            component: () => import('@/components/analytics/ReadingAnalyticsCard'),
            featureFlag: 'reading_analytics_card',
            order: 1,
            enabled: true
          },
          {
            id: 'xp-breakdown',
            title: 'XP Breakdown',
            component: () => import('@/components/analytics/XPBreakdownCard'),
            featureFlag: 'xp_breakdown_card',
            order: 2,
            enabled: true
          },
          {
            id: 'study-performance',
            title: 'Study Performance',
            component: () => import('@/components/analytics/StudyPerformanceCard'),
            featureFlag: 'study_performance_card',
            order: 3,
            enabled: true
          },
          {
            id: 'ai-coach-engagement',
            title: 'AI Coach Engagement',
            component: () => import('@/components/analytics/AICoachEngagementCard'),
            featureFlag: 'ai_coach_analytics_card',
            order: 4,
            enabled: true
          }
        ];

        // Filter cards based on feature flags
        const enabledCards = cardConfigs.filter(card => {
          if (card.featureFlag) {
            return featureFlagService.isEnabled(card.featureFlag);
          }
          return card.enabled;
        });

        // Sort by order
        enabledCards.sort((a, b) => a.order - b.order);

        setCards(enabledCards);
      } catch (error) {
        console.error('Error loading analytics cards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  const updateCardOrder = (cardId: string, newOrder: number) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, order: newOrder } : card
      ).sort((a, b) => a.order - b.order)
    );
  };

  const toggleCard = (cardId: string, enabled: boolean) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, enabled } : card
      )
    );
  };

  return {
    cards,
    loading,
    updateCardOrder,
    toggleCard
  };
};
