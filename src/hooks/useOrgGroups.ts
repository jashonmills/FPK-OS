import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';

export interface OrgGroup {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export function useOrgGroups() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = assertOrg();

  const { data: groups = [], isLoading, error } = useQuery({
    queryKey: ['org-groups', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_groups')
        .select(`
          *,
          member_count:org_group_members(count)
        `)
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching org groups:', error);
        throw error;
      }

      return data?.map(group => ({
        ...group,
        member_count: group.member_count?.[0]?.count || 0
      })) as OrgGroup[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: { name: string }) => {
      const { data, error } = await supabase
        .from('org_groups')
        .insert({
          name: groupData.name,
          org_id: orgId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-groups'] });
      toast({
        title: "Success",
        description: "Group created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group.",
        variant: "destructive",
      });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: async (groupData: { id: string; name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('org_groups')
        .update({
          name: groupData.name,
          description: groupData.description,
        })
        .eq('id', groupData.id)
        .eq('org_id', orgId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-groups'] });
      toast({
        title: "Success",
        description: "Group updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating group:', error);
      toast({
        title: "Error",
        description: "Failed to update group.",
        variant: "destructive",
      });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('org_groups')
        .delete()
        .eq('id', groupId)
        .eq('org_id', orgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-groups'] });
      toast({
        title: "Success",
        description: "Group deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting group:', error);
      toast({
        title: "Error",
        description: "Failed to delete group.",
        variant: "destructive",
      });
    },
  });

  return {
    groups,
    isLoading,
    error,
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
}