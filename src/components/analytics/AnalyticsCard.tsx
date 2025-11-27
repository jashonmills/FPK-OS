
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { featureFlagService } from '@/services/FeatureFlagService';
import { useCleanup } from '@/utils/cleanupManager';

export interface AnalyticsCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
  featureFlag?: string;
  refreshInterval?: number;
  onRefresh?: () => void;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-600',
  children,
  className = '',
  loading = false,
  error = null,
  featureFlag,
  refreshInterval,
  onRefresh
}) => {
  const cleanup = useCleanup('analytics-card');

  // Check feature flag
  if (featureFlag && !featureFlagService.isEnabled(featureFlag)) {
    return null;
  }

  // Auto-refresh logic with cleanupManager
  React.useEffect(() => {
    if (refreshInterval && onRefresh) {
      cleanup.setInterval(onRefresh, refreshInterval * 1000);
    }
  }, [refreshInterval, onRefresh, cleanup]);

  if (loading) {
    return (
      <Card className={`border-0 shadow-lg ${className}`} data-analytics-card={id}>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg">
            {Icon && <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />}
            {title}
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-auto"></div>
          </CardTitle>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`border-0 shadow-lg border-red-200 ${className}`} data-analytics-card={id}>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg text-red-600">
            {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-center py-6">
            <p className="text-red-600 font-medium">Error loading data</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-0 shadow-lg ${className}`} data-analytics-card={id}>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          {Icon && <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />}
          {title}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors"
              title="Refresh data"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {children}
      </CardContent>
    </Card>
  );
};
