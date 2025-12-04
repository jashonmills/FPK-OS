import { EmptyState } from '@/components/shared/EmptyState';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AnalyticsEmptyState = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={BarChart3}
      title="Unlock Your Data's Potential"
      description="This page will come to life once you have enough data. Our universal and diagnosis-specific charts will help you visualize patterns, understand triggers, and see the impact of interventions over time."
      actionLabel="Start Logging Data"
      onAction={() => navigate('/activity-log')}
      secondaryText="Start by logging at least one week of data to begin seeing your first insights."
    />
  );
};
