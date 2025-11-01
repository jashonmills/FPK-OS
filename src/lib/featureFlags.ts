/**
 * Feature Flag System for FPK University
 * 
 * Simple feature flag system using environment variables.
 * In production, this could be replaced with LaunchDarkly, Vercel flags, etc.
 */

export const FeatureFlags = {
  USE_USER_HUB: import.meta.env.VITE_FEATURE_USE_USER_HUB === 'true',
  ENFORCE_SUBSCRIPTION: import.meta.env.VITE_FEATURE_ENFORCE_SUBSCRIPTION === 'true',
  ENABLE_PLATFORM_GUIDE: import.meta.env.VITE_FEATURE_ENABLE_PLATFORM_GUIDE !== 'false', // Default enabled
  ENABLE_BETA_FEATURES: import.meta.env.VITE_FEATURE_ENABLE_BETA_FEATURES === 'true', // Default disabled
  ENABLE_LIBRARY: import.meta.env.VITE_FEATURE_ENABLE_LIBRARY === 'true', // Default disabled
} as const;

export function isFeatureEnabled(flag: keyof typeof FeatureFlags): boolean {
  return FeatureFlags[flag] === true;
}

/**
 * Check if User Hub should be used as the default post-login destination
 */
export function shouldUseUserHub(): boolean {
  return isFeatureEnabled('USE_USER_HUB');
}

/**
 * Check if subscription enforcement is active (blocks non-paying users from premium features)
 */
export function shouldEnforceSubscription(): boolean {
  return isFeatureEnabled('ENFORCE_SUBSCRIPTION');
}

/**
 * Check if Platform Guide should be visible (documentation system)
 */
export function shouldShowPlatformGuide(): boolean {
  return isFeatureEnabled('ENABLE_PLATFORM_GUIDE');
}

/**
 * Check if beta features should be visible (access gate, onboarding, admin tools)
 */
export function shouldShowBetaFeatures(): boolean {
  return isFeatureEnabled('ENABLE_BETA_FEATURES');
}

/**
 * Check if Library feature should be visible
 */
export function shouldShowLibrary(): boolean {
  return isFeatureEnabled('ENABLE_LIBRARY');
}
