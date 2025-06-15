
import React, { Suspense, lazy } from 'react';
import { AnalyticsCard } from './AnalyticsCard';
import { useAnalyticsCards } from '@/hooks/useAnalyticsCards';
import { featureFlagService } from '@/services/FeatureFlagService';

interface AnalyticsCardContainerProps {
  layout?: 'grid' | 'list';
  maxCards?: number;
  allowReordering?: boolean;
  className?: string;
}

export const AnalyticsCardContainer: React.FC<AnalyticsCardContainerProps> = ({
  layout = 'grid',
  maxCards,
  allowReordering = false,
  className = ''
}) => {
  const { cards, loading } = useAnalyticsCards();

  if (loading) {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <AnalyticsCard
            key={i}
            id={`loading-${i}`}
            title="Loading..."
            loading={true}
          >
            <div />
          </AnalyticsCard>
        ))}
      </div>
    );
  }

  const displayCards = maxCards ? cards.slice(0, maxCards) : cards;
  const gridClass = layout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4 sm:space-y-6';

  return (
    <div className={`${gridClass} ${className}`}>
      {displayCards.map((cardConfig) => {
        // Check feature flag again at render time
        if (cardConfig.featureFlag && !featureFlagService.isEnabled(cardConfig.featureFlag)) {
          return null;
        }

        return (
          <Suspense
            key={cardConfig.id}
            fallback={
              <AnalyticsCard
                id={cardConfig.id}
                title={cardConfig.title}
                loading={true}
              >
                <div />
              </AnalyticsCard>
            }
          >
            <LazyAnalyticsCard cardConfig={cardConfig} />
          </Suspense>
        );
      })}
    </div>
  );
};

// Helper component to handle lazy loading
const LazyAnalyticsCard: React.FC<{ cardConfig: any }> = ({ cardConfig }) => {
  const [CardComponent, setCardComponent] = React.useState<React.ComponentType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        let component;
        
        // Map card IDs to their components
        switch (cardConfig.id) {
          case 'reading-analytics':
            component = await import('@/components/analytics/ReadingAnalyticsCard');
            break;
          case 'ai-coach-engagement':
            component = await import('@/components/analytics/AICoachEngagementCard');
            break;
          default:
            throw new Error(`Unknown card component: ${cardConfig.id}`);
        }
        
        setCardComponent(() => component.default);
      } catch (err) {
        console.error(`Error loading card component ${cardConfig.id}:`, err);
        setError(`Failed to load ${cardConfig.title}`);
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [cardConfig.id, cardConfig.title]);

  if (loading || !CardComponent) {
    return (
      <AnalyticsCard
        id={cardConfig.id}
        title={cardConfig.title}
        loading={true}
        featureFlag={cardConfig.featureFlag}
      >
        <div />
      </AnalyticsCard>
    );
  }

  if (error) {
    return (
      <AnalyticsCard
        id={cardConfig.id}
        title={cardConfig.title}
        error={error}
        featureFlag={cardConfig.featureFlag}
      >
        <div />
      </AnalyticsCard>
    );
  }

  return <CardComponent {...(cardConfig.props || {})} />;
};
