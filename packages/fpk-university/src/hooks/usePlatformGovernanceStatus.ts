import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePlatformGovernanceStatus() {
  return useQuery({
    queryKey: ['platform-governance-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_knowledge_base')
        .select('id')
        .eq('is_active', true)
        .eq('is_default', true)
        .limit(1);

      if (error) {
        console.error('Error checking platform governance status:', error);
        return { isProtected: false };
      }

      return { isProtected: (data?.length ?? 0) > 0 };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - rarely changes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}
