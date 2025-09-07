import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { toast } from 'sonner';

export interface OrgGoal {
  id: string;
  title: string;
  description: string;
  student_id: string;
  priority: string;
  status: string;
  progress_percentage: number;
  target_date: string;
  category?: string;
  folder_path?: string;
  created_at: string;
  updated_at: string;
  student_name?: string;
}

export function useOrgGoals(searchQuery?: string, statusFilter?: string) {
  const { currentOrg } = useOrgContext();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['org-goals', currentOrg?.organization_id, searchQuery, statusFilter],
    queryFn: async (): Promise<OrgGoal[]> => {
      if (!currentOrg?.organization_id) {
        throw new Error('No organization selected');
      }

      let query = supabase
        .from('org_goals')
        .select('*')
        .eq('organization_id', currentOrg.organization_id)
        .order('updated_at', { ascending: false });

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(goal => ({
        ...goal,
        student_name: 'Student' // Placeholder - would need profile lookup
      }));
    },
    enabled: !!currentOrg?.organization_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createGoal = useMutation({
    mutationFn: async (goalData: Partial<OrgGoal> & { created_by: string }) => {
      if (!currentOrg?.organization_id) {
        throw new Error('No organization selected');
      }

      const { data, error } = await supabase
        .from('org_goals')
        .insert({
          title: goalData.title || '',
          description: goalData.description,
          student_id: goalData.student_id || '',
          priority: goalData.priority,
          status: goalData.status,
          progress_percentage: goalData.progress_percentage,
          target_date: goalData.target_date,
          category: goalData.category,
          folder_path: goalData.folder_path,
          organization_id: currentOrg.organization_id,
          created_by: goalData.created_by,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-goals'] });
      queryClient.invalidateQueries({ queryKey: ['org-statistics'] });
      toast.success('Goal created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create goal: ' + error.message);
    },
  });

  const updateGoal = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<OrgGoal> & { id: string }) => {
      const { data, error } = await supabase
        .from('org_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-goals'] });
      queryClient.invalidateQueries({ queryKey: ['org-statistics'] });
      toast.success('Goal updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update goal: ' + error.message);
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('org_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-goals'] });
      queryClient.invalidateQueries({ queryKey: ['org-statistics'] });
      toast.success('Goal deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete goal: ' + error.message);
    },
  });

  return {
    ...query,
    createGoal,
    updateGoal,
    deleteGoal,
  };
}