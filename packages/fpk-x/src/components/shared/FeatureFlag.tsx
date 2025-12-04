import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { ReactNode } from 'react';

interface FeatureFlagProps {
  flag: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export const FeatureFlag = ({ flag, fallback = null, children }: FeatureFlagProps) => {
  const { flags, loading } = useFeatureFlags([flag]);
  
  if (loading) return null;
  return flags[flag] ? <>{children}</> : <>{fallback}</>;
};
