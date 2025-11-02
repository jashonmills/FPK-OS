import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeatureFlags {
  FEATURE_KANBAN: boolean;
  FEATURE_BUDGET: boolean;
  FEATURE_DEVELOPMENT: boolean;
  FEATURE_PLANNING: boolean;
  FEATURE_MESSAGES: boolean;
  FEATURE_AI_CHATBOT: boolean;
  FEATURE_DOCUMENTATION: boolean;
  FEATURE_FILES: boolean;
  FEATURE_CALENDAR_SYNC: boolean;
}

interface FeatureFlagContextType {
  features: FeatureFlags;
  loading: boolean;
  isFeatureEnabled: (featureName: keyof FeatureFlags) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureFlags>({
    FEATURE_KANBAN: true,
    FEATURE_BUDGET: false,
    FEATURE_DEVELOPMENT: false,
    FEATURE_PLANNING: false,
    FEATURE_MESSAGES: true,
    FEATURE_AI_CHATBOT: false,
    FEATURE_DOCUMENTATION: false,
    FEATURE_FILES: false,
    FEATURE_CALENDAR_SYNC: true,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeatureFlags = async (retryCount = 0) => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('name, enabled');

        if (error) throw error;

        if (data) {
          const flagsMap: Record<string, boolean> = {};
          data.forEach(flag => {
            flagsMap[flag.name] = flag.enabled;
          });
          setFeatures(prev => ({ ...prev, ...flagsMap }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feature flags (attempt ' + (retryCount + 1) + '):', error);
        
        // Retry with exponential backoff (max 3 retries)
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 500;
          setTimeout(() => fetchFeatureFlags(retryCount + 1), delay);
        } else {
          setLoading(false);
        }
      }
    };

    fetchFeatureFlags();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags',
        },
        () => {
          console.log('Feature flags updated, refetching...');
          fetchFeatureFlags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const isFeatureEnabled = (featureName: keyof FeatureFlags): boolean => {
    return features[featureName] || false;
  };

  return (
    <FeatureFlagContext.Provider value={{ features, loading, isFeatureEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};
