import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ToolModelAssignment {
  id: string;
  org_id: string | null;
  tool_id: string;
  model_config_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tool?: {
    id: string;
    display_name: string;
    description: string;
  };
  model?: {
    id: string;
    model_id: string;
    model_name: string;
    provider: string;
  };
}

export function useToolModelAssignments(orgId?: string | null) {
  const queryClient = useQueryClient();

  const assignmentsQuery = useQuery({
    queryKey: ['tool-model-assignments', orgId],
    queryFn: async () => {
      // Fetch assignments with joined tool and model data
      let query = supabase
        .from('ai_tool_model_assignments')
        .select(`
          *,
          ai_tools (
            id,
            display_name,
            description
          ),
          ai_governance_model_configs (
            id,
            model_id,
            model_name,
            provider
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      // If orgId provided, get org-specific + global defaults
      if (orgId) {
        query = query.or(`org_id.eq.${orgId},org_id.is.null`);
      } else {
        // Otherwise just get global defaults
        query = query.is('org_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.map(assignment => ({
        ...assignment,
        tool: assignment.ai_tools,
        model: assignment.ai_governance_model_configs,
      })) as ToolModelAssignment[];
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ 
      toolId, 
      modelConfigId, 
      orgId: targetOrgId 
    }: { 
      toolId: string; 
      modelConfigId: string; 
      orgId?: string | null 
    }) => {
      // Upsert the assignment
      const { data, error } = await supabase
        .from('ai_tool_model_assignments')
        .upsert({
          tool_id: toolId,
          model_config_id: modelConfigId,
          org_id: targetOrgId || null,
          is_active: true,
        }, {
          onConflict: 'org_id,tool_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-model-assignments'] });
      toast.success('Model assignment updated');
    },
    onError: (error) => {
      toast.error('Failed to update assignment: ' + error.message);
    },
  });

  const deleteOrgOverride = useMutation({
    mutationFn: async ({ toolId, orgId: targetOrgId }: { toolId: string; orgId: string }) => {
      const { error } = await supabase
        .from('ai_tool_model_assignments')
        .delete()
        .eq('tool_id', toolId)
        .eq('org_id', targetOrgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tool-model-assignments'] });
      toast.success('Org override removed, using global default');
    },
    onError: (error) => {
      toast.error('Failed to remove override: ' + error.message);
    },
  });

  // Helper to get effective assignment for a tool (org-specific or global)
  const getEffectiveAssignment = (toolId: string): ToolModelAssignment | undefined => {
    const assignments = assignmentsQuery.data || [];
    
    // Look for org-specific first
    if (orgId) {
      const orgAssignment = assignments.find(a => a.tool_id === toolId && a.org_id === orgId);
      if (orgAssignment) return orgAssignment;
    }
    
    // Fall back to global
    return assignments.find(a => a.tool_id === toolId && !a.org_id);
  };

  return {
    assignments: assignmentsQuery.data ?? [],
    isLoading: assignmentsQuery.isLoading,
    error: assignmentsQuery.error,
    updateAssignment,
    deleteOrgOverride,
    getEffectiveAssignment,
  };
}
