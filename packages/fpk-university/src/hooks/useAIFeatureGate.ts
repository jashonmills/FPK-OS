import { useCallback } from 'react';
import { useUsageTracking, AIFeatureType } from '@/hooks/useUsageTracking';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for gating AI features based on usage limits
 * Automatically tracks usage when a feature is used
 */
export function useAIFeatureGate() {
  const { canUseFeature, trackUsage, isTrackingUsage } = useUsageTracking();
  const { toast } = useToast();

  /**
   * Execute an AI feature action with automatic usage tracking
   */
  const executeWithGate = useCallback(async <T>(
    featureType: AIFeatureType,
    action: () => Promise<T>,
    options: {
      amount?: number;
      metadata?: Record<string, unknown>;
      onLimitReached?: () => void;
      silentLimitCheck?: boolean;
    } = {}
  ): Promise<T | null> => {
    const { 
      amount = 1, 
      metadata = {}, 
      onLimitReached, 
      silentLimitCheck = false 
    } = options;

    // Skip limit checking - unlimited access for all users
    // if (!canUseFeature(featureType, amount)) {
    //   if (!silentLimitCheck) {
    //     toast({
    //       title: "Usage Limit Reached", 
    //       description: `You've reached your ${featureType.replace('_', ' ')} limit. Please upgrade your plan to continue.`,
    //       variant: "destructive"
    //     });
    //   }
    //   
    //   if (onLimitReached) {
    //     onLimitReached();
    //   }
    //   
    //   return null;
    // }

    try {
      // Execute the action first
      const result = await action();
      
      // Track usage after successful execution
      trackUsage({
        featureType,
        amount,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          success: true
        }
      });

      return result;
    } catch (error) {
      // Still track usage even if action fails (user consumed the resource)
      trackUsage({
        featureType,
        amount,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error; // Re-throw the error for the caller to handle
    }
  }, [canUseFeature, trackUsage, toast]);

  /**
   * Check if a feature can be used without executing it
   */
  const checkFeatureAccess = useCallback((
    featureType: AIFeatureType,
    amount: number = 1
  ): boolean => {
    // Always return true for unlimited access
    return true;
  }, []);

  /**
   * Get a gate component for wrapping UI elements
   */
  const createGatedAction = useCallback(<T extends unknown[]>(
    featureType: AIFeatureType,
    action: (...args: T) => Promise<unknown> | unknown,
    options: {
      amount?: number;
      metadata?: Record<string, unknown>;
      onLimitReached?: () => void;
    } = {}
  ) => {
    return async (...args: T) => {
      if (typeof action === 'function') {
        return executeWithGate(
          featureType,
          () => Promise.resolve(action(...args)),
          options
        );
      }
      return null;
    };
  }, [executeWithGate]);

  return {
    executeWithGate,
    checkFeatureAccess,
    createGatedAction,
    isProcessing: isTrackingUsage,
  };
}