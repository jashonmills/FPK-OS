import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Educator {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'active' | 'blocked' | 'paused' | 'removed';
  linked_user_id: string | null;
  activation_token: string | null;
  activation_status: string;
  activation_expires_at: string | null;
  invited_at: string;
  invited_by: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

interface CreateEducatorData {
  full_name: string;
  email: string;
  role: string;
}

export function useOrgEducators(orgId: string | undefined) {
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadEducators = async () => {
    if (!orgId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('org_educators')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEducators(data || []);
    } catch (error) {
      console.error('Error loading educators:', error);
      toast({
        title: "Error",
        description: "Failed to load educators",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducators();
  }, [orgId]);

  const createEducatorInvite = async (educatorData: CreateEducatorData) => {
    if (!orgId) return;

    try {
      const { data, error } = await supabase.functions.invoke('educator-invite', {
        body: {
          org_id: orgId,
          ...educatorData,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invitation sent to ${educatorData.email}`,
      });

      await loadEducators();
      return data;
    } catch (error: any) {
      console.error('Error creating educator invite:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEducatorStatus = async (educatorId: string, status: 'active' | 'blocked' | 'paused' | 'removed') => {
    try {
      const { error } = await supabase
        .from('org_educators')
        .update({ status })
        .eq('id', educatorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Educator status updated",
      });

      await loadEducators();
    } catch (error) {
      console.error('Error updating educator status:', error);
      toast({
        title: "Error",
        description: "Failed to update educator status",
        variant: "destructive",
      });
    }
  };

  const regenerateActivationToken = async (educatorId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('educator-invite', {
        body: {
          regenerate_token: true,
          educator_id: educatorId,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "New activation link sent",
      });

      await loadEducators();
      return data;
    } catch (error) {
      console.error('Error regenerating token:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate activation token",
        variant: "destructive",
      });
    }
  };

  return {
    educators,
    loading,
    createEducatorInvite,
    updateEducatorStatus,
    regenerateActivationToken,
    reload: loadEducators,
  };
}
