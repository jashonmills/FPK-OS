import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useToast } from '@/hooks/use-toast';

export interface OrgAssignment {
  id: string;
  org_id: string;
  title: string;
  resource_id: string;
  type: string;
  created_by: string;
  created_at: string;
  // Additional computed fields
  description?: string;
  due_date?: string | null;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'completed' | 'overdue' | 'archived';
  course_id?: string | null;
  assigned_to?: number;
  completed?: number;
}

export const useOrgAssignments = (searchQuery?: string, statusFilter?: string) => {
  const { currentOrg } = useOrgContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['org-assignments', currentOrg?.organization_id, searchQuery, statusFilter],
    queryFn: async () => {
      if (!currentOrg?.organization_id) return [];
      
      // Using existing org_goals table as assignments for now
      let query = supabase
        .from('org_goals')
        .select('*')
        .eq('organization_id', currentOrg.organization_id);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching assignments:', error);
        throw error;
      }

      // Get student counts
      const { count: totalStudents } = await supabase
        .from('org_members')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', currentOrg.organization_id)
        .eq('role', 'student')
        .eq('status', 'active');

      // Transform goals to assignments format
      const assignments = data.map(goal => ({
        ...goal,
        org_id: goal.organization_id,
        resource_id: goal.id,
        type: 'assignment',
        description: goal.description,
        due_date: goal.target_date,
        priority: 'medium' as const,
        status: goal.status === 'completed' ? 'completed' : 'active' as const,
        assigned_to: totalStudents || 0,
        completed: Math.floor((goal.progress_percentage / 100) * (totalStudents || 0)),
      }));

      return assignments as OrgAssignment[];
    },
    enabled: !!currentOrg?.organization_id,
  });

  const createAssignment = useMutation({
    mutationFn: async (assignmentData: {
      title: string;
      description?: string;
      due_date?: string;
      priority?: 'low' | 'medium' | 'high';
      course_id?: string;
    }) => {
      if (!currentOrg?.organization_id) throw new Error('No organization selected');

      // Create as a goal for now  
      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('org_goals')
        .insert({
          organization_id: currentOrg.organization_id,
          title: assignmentData.title,
          description: assignmentData.description || '',
          target_date: assignmentData.due_date,
          status: 'active',
          progress_percentage: 0,
          created_by: user.user?.id || '',
          student_id: user.user?.id || '',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-assignments'] });
      toast({
        title: 'Success',
        description: 'Assignment created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create assignment',
        variant: 'destructive',
      });
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<OrgAssignment> & { id: string }) => {
      const { data, error } = await supabase
        .from('org_goals')
        .update({
          title: updates.title,
          description: updates.description,
          target_date: updates.due_date,
          status: updates.status === 'completed' ? 'completed' : 'active',
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-assignments'] });
      toast({
        title: 'Success',
        description: 'Assignment updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update assignment',
        variant: 'destructive',
      });
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('org_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-assignments'] });
      toast({
        title: 'Success',
        description: 'Assignment deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete assignment',
        variant: 'destructive',
      });
    },
  });

  return {
    assignments,
    isLoading,
    createAssignment: createAssignment.mutate,
    updateAssignment: updateAssignment.mutate,
    deleteAssignment: deleteAssignment.mutate,
  };
};