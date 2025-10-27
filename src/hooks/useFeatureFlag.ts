import { useFeatureFlags } from "@/contexts/FeatureFlagContext";

/**
 * Hook to check if a feature flag is enabled
 * @param flagName - The name of the feature flag to check
 * @returns boolean - Whether the feature is enabled
 */
export const useFeatureFlag = (flagName: string): boolean => {
  const { flags, loading } = useFeatureFlags();
  
  // While loading, return false to hide features by default
  if (loading) return false;
  
  // Return the flag value, defaulting to false if not found
  return flags[flagName] ?? false;
};
