import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';

interface FeatureFlagGuardProps {
  children: ReactNode;
  feature: 'FEATURE_KANBAN' | 'FEATURE_BUDGET' | 'FEATURE_DEVELOPMENT' | 'FEATURE_PLANNING' | 'FEATURE_MESSAGES' | 'FEATURE_AI_CHATBOT' | 'FEATURE_DOCUMENTATION' | 'FEATURE_FILES' | 'FEATURE_CALENDAR_SYNC' | 'FEATURE_PAYROLL' | 'FEATURE_TIMESHEET' | 'FEATURE_HELP_CENTER';
  redirectTo?: string;
}

export const FeatureFlagGuard = ({ children, feature, redirectTo = '/' }: FeatureFlagGuardProps) => {
  const { isFeatureEnabled, loading } = useFeatureFlags();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isFeatureEnabled(feature)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
