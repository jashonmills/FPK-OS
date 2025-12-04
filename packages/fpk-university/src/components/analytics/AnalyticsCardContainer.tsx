
import React, { Suspense } from 'react';
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

        const CardComponent = cardConfig.component;

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
            <CardComponent {...(cardConfig.props || {})} />
          </Suspense>
        );
      })}
    </div>
  );
};
