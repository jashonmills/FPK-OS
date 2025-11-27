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
  ENABLE_LIVE_HUB: import.meta.env.VITE_FEATURE_ENABLE_LIVE_HUB !== 'false', // Default enabled
  LEGACY_AI_ASSISTANT_ENABLED: import.meta.env.VITE_FEATURE_LEGACY_AI_ASSISTANT_ENABLED !== 'false', // Default enabled
  ENABLE_TTS: import.meta.env.VITE_FEATURE_ENABLE_TTS !== 'false', // Default enabled (for future subscription gating)
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

/**
 * Check if Live Learning Hub should be visible
 */
export function shouldShowLiveHub(): boolean {
  return isFeatureEnabled('ENABLE_LIVE_HUB');
}

/**
 * Check if legacy AI Assistant page should be accessible
 * (Default: true - enabled for organization AI Coach functionality)
 */
export function shouldShowLegacyAIAssistant(): boolean {
  return isFeatureEnabled('LEGACY_AI_ASSISTANT_ENABLED');
}

/**
 * Check if Text-to-Speech should be enabled
 * (Default: true - can be gated by subscription tier in the future)
 */
export function shouldEnableTTS(): boolean {
  return isFeatureEnabled('ENABLE_TTS');
}
