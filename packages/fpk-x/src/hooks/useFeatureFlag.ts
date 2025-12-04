import { useFeatureFlags } from './useFeatureFlags';

/**
 * Simple hook to check a single feature flag
 * Wraps useFeatureFlags for convenience when checking one flag
 */
export const useFeatureFlag = (flagKey: string) => {
  const { flags, loading } = useFeatureFlags([flagKey]);
  
  return {
    isEnabled: flags[flagKey] || false,
    loading
  };
};
