import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlag {
  flag_key: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: string[];
}

export const useFeatureFlags = (flagKeys: string[]) => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          setLoading(false);
          return;
        }

        // Check for user-specific overrides first
        const { data: overrides } = await supabase
          .from('user_feature_overrides')
          .select('flag_key, is_enabled')
          .eq('user_id', user.user.id)
          .in('flag_key', flagKeys);

        // Get global feature flags
        const { data: globalFlags } = await supabase
          .from('feature_flags')
          .select('flag_key, is_enabled, rollout_percentage, target_users')
          .in('flag_key', flagKeys);

        const flagMap: Record<string, boolean> = {};

        flagKeys.forEach(key => {
          // Check user override first
          const override = overrides?.find(o => o.flag_key === key);
          if (override) {
            flagMap[key] = override.is_enabled;
            return;
          }

          // Check global flag
          const flag = globalFlags?.find(f => f.flag_key === key);
          if (!flag) {
            flagMap[key] = false;
            return;
          }

          // Check if user is in target list
          if (flag.target_users && Array.isArray(flag.target_users) && flag.target_users.includes(user.user.id)) {
            flagMap[key] = true;
            return;
          }

          // Check rollout percentage (simple hash-based distribution)
          if (flag.rollout_percentage === 100) {
            flagMap[key] = flag.is_enabled;
          } else if (flag.rollout_percentage === 0) {
            flagMap[key] = false;
          } else {
            // Simple percentage-based rollout
            const userHash = user.user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const isInRollout = (userHash % 100) < flag.rollout_percentage;
            flagMap[key] = flag.is_enabled && isInRollout;
          }
        });

        setFlags(flagMap);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, [flagKeys.join(',')]);

  return { flags, loading };
};
