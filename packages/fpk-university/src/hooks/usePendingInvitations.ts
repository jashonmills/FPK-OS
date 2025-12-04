import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActiveOrgId } from '@/lib/org/context';

export interface PendingInvitation {
  id: string;
  invited_email: string;
  invite_token: string;
  role: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  created_by: string | null;
}

export function usePendingInvitations() {
  const orgId = getActiveOrgId();

  return useQuery({
    queryKey: ['pending-invitations', orgId],
    enabled: !!orgId,
    queryFn: async () => {
      if (!orgId) return [];
      
      const { data, error } = await supabase
        .from('user_invites')
        .select(`
          id,
          invited_email,
          invite_token,
          role,
          created_at,
          expires_at,
          is_used,
          used_at,
          created_by
        `)
        .eq('org_id', orgId)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending invitations:', error);
        throw error;
      }

      return (data || []) as PendingInvitation[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
