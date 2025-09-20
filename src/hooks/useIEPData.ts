import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ParentIEPResponse {
  id: string;
  session_id: string;
  org_id: string;
  form_section: string;
  form_data: any;
  submitted_at: string;
  updated_at: string;
}

export function useIEPData(orgId?: string) {
  const [parentResponses, setParentResponses] = useState<ParentIEPResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchParentResponses = async () => {
    if (!orgId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('parent_iep_data')
        .select('*')
        .eq('org_id', orgId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setParentResponses(data || []);
    } catch (error) {
      console.error('Error fetching parent IEP responses:', error);
      toast.error('Failed to load parent responses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParentResponses();
  }, [orgId]);

  return {
    parentResponses,
    isLoading,
    refetch: fetchParentResponses
  };
}