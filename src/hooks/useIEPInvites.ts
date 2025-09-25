import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IEPInvite {
  id: string;
  org_id: string;
  code: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  status: string;
  metadata: any;
}

export function useIEPInvites(orgId?: string) {
  const [invites, setInvites] = useState<IEPInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = async () => {
    if (!orgId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('iep_invites')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error('Error fetching IEP invites:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load invites';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createInvite = async (parentEmail: string) => {
    if (!orgId) throw new Error('Organization ID required');

    setIsLoading(true);
    try {
      // Call edge function to create invite and send email
      const { data, error } = await supabase.functions.invoke('send-iep-invitation', {
        body: {
          orgId,
          parentEmail
        }
      });

      if (error) throw error;

      // Refresh invites list
      await fetchInvites();
      
      return data;
    } catch (error) {
      console.error('Error creating IEP invite:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvite = async (inviteId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('iep_invites')
        .update({ status: 'disabled' })
        .eq('id', inviteId);

      if (error) throw error;

      // Refresh invites list
      await fetchInvites();
      toast.success('Invite disabled');
    } catch (error) {
      console.error('Error disabling IEP invite:', error);
      toast.error('Failed to disable invite');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [orgId]);

  return {
    invites,
    createInvite,
    deleteInvite,
    isLoading,
    error,
    refetch: fetchInvites
  };
}