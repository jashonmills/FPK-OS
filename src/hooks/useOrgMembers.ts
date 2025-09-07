import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useToast } from '@/hooks/use-toast';

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: 'owner' | 'instructor' | 'student';
  status: 'active' | 'paused' | 'blocked' | 'removed';
  joined_at: string;
  // Profile data - simplified structure
  full_name?: string;
  display_name?: string;
  // Computed stats
  progress?: number;
  courses_completed?: number;
  last_activity?: string;
}

export const useOrgMembers = (searchQuery?: string, roleFilter?: string) => {
  const { currentOrg } = useOrgContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['org-members', currentOrg?.organization_id, searchQuery, roleFilter],
    queryFn: async () => {
      if (!currentOrg?.organization_id) return [];
      
      let query = supabase
        .from('org_members')
        .select(`
          *,
          profile:profiles(full_name, display_name)
        `)
        .eq('org_id', currentOrg.organization_id);

      const { data, error } = await query.order('joined_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      // Transform and add mock data for display
      const membersWithStats = data.map(member => ({
        ...member,
        full_name: `Student ${member.user_id.slice(0, 8)}`,
        display_name: `Student ${member.user_id.slice(0, 8)}`,
        progress: Math.floor(Math.random() * 100),
        courses_completed: Math.floor(Math.random() * 5),
        last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      // Filter by search query if provided
      let filteredData = membersWithStats;
      if (searchQuery) {
        filteredData = membersWithStats.filter(member => {
          const fullName = member.full_name?.toLowerCase() || '';
          const displayName = member.display_name?.toLowerCase() || '';
          const query = searchQuery.toLowerCase();
          return fullName.includes(query) || displayName.includes(query);
        });
      }

      return filteredData as OrgMember[];
    },
    enabled: !!currentOrg?.organization_id,
  });

  const updateMemberRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'owner' | 'instructor' | 'student' }) => {
      const { data, error } = await supabase
        .from('org_members')
        .update({ role })
        .eq('org_id', currentOrg?.organization_id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members'] });
      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating member role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member role',
        variant: 'destructive',
      });
    },
  });

  const updateMemberStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'paused' | 'blocked' | 'removed' }) => {
      const { data, error } = await supabase
        .from('org_members')
        .update({ status })
        .eq('org_id', currentOrg?.organization_id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members'] });
      toast({
        title: 'Success',
        description: 'Member status updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating member status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member status',
        variant: 'destructive',
      });
    },
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('org_members')
        .delete()
        .eq('org_id', currentOrg?.organization_id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members'] });
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    },
    onError: (error) => {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    },
  });

  return {
    members,
    isLoading,
    updateMemberRole: updateMemberRole.mutate,
    updateMemberStatus: updateMemberStatus.mutate,
    removeMember: removeMember.mutate,
  };
};