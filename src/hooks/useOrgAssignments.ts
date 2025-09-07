import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';

export interface OrgAssignment {
  id: string;
  org_id: string;
  type: string;
  resource_id: string;
  title: string;
  created_by: string;
  created_at: string;
}

export interface AssignmentTarget {
  assignment_id: string;
  target_id: string;
  target_type: string;
}

export function useOrgAssignments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = assertOrg();

  const { data: assignments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-assignments', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_assignments')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching org assignments:', error);
        throw error;
      }

      return data as OrgAssignment[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: { title: string; type: string; resource_id: string }) => {
      // Create assignment using existing table structure
      const { data: assignmentResult, error: assignmentError } = await supabase
        .from('org_assignments')
        .insert({
          ...assignmentData,
          org_id: orgId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;
      return assignmentResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-assignments'] });
      toast({
        title: "Success",
        description: "Assignment created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment.",
        variant: "destructive",
      });
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: Partial<OrgAssignment> & { id: string }) => {
      const { id, ...updateData } = assignmentData;
      const { data, error } = await supabase
        .from('org_assignments')
        .update(updateData)
        .eq('id', id)
        .eq('org_id', orgId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-assignments'] });
      toast({
        title: "Success",
        description: "Assignment updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment.",
        variant: "destructive",
      });
    },
  });

  return {
    assignments,
    isLoading,
    error,
    refetch,
    createAssignment: createAssignmentMutation.mutate,
    updateAssignment: updateAssignmentMutation.mutate,
    isCreating: createAssignmentMutation.isPending,
    isUpdating: updateAssignmentMutation.isPending,
  };
}

export function useAssignmentTargets(assignmentId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: targets = [], isLoading } = useQuery({
    queryKey: ['assignment-targets', assignmentId],
    queryFn: async () => {
      if (!assignmentId) return [];
      
      const { data, error } = await supabase
        .from('org_assignment_targets')
        .select('*')
        .eq('assignment_id', assignmentId);

      if (error) {
        console.error('Error fetching assignment targets:', error);
        throw error;
      }

      return data as AssignmentTarget[];
    },
    enabled: !!assignmentId,
  });

  return {
    targets,
    isLoading,
  };
}