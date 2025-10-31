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
    FEATURE_MESSAGES: false,
    FEATURE_AI_CHATBOT: false,
    FEATURE_DOCUMENTATION: false,
    FEATURE_FILES: false,
    FEATURE_CALENDAR_SYNC: false,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('name, enabled');

        if (error) throw error;

        if (data) {
          const flagsMap = data.reduce((acc, flag) => {
            acc[flag.name as keyof FeatureFlags] = flag.enabled;
            return acc;
          }, {} as FeatureFlags);

          setFeatures(flagsMap);
        }
      } catch (error) {
        console.error('Error fetching feature flags:', error);
        toast({
          title: 'Error',
          description: 'Failed to load feature flags. Using defaults.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureFlags();
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
