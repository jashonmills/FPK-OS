import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  added_at: string;
  added_by: string;
  profiles?: {
    display_name?: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

export interface AvailableStudent {
  user_id: string;
  display_name?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  role: string;
  status: string;
}

export function useOrgGroupMembers(groupId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = assertOrg();

  // Fetch current group members
  const { data: members = [], isLoading: loadingMembers, error } = useQuery({
    queryKey: ['org-group-members', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      if (!groupId) return [];

      // Fetch group members
      const { data: groupMembers, error: membersError } = await supabase
        .from('org_group_members')
        .select('*')
        .eq('group_id', groupId)
        .order('added_at', { ascending: false });

      if (membersError) {
        console.error('Error fetching group members:', membersError);
        throw membersError;
      }

      if (!groupMembers || groupMembers.length === 0) {
        return [];
      }

      // Fetch profiles for all members
      const userIds = groupMembers.map(m => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, email, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Fetch org_students data (legacy system)
      const { data: orgStudents, error: orgStudentsError } = await supabase
        .from('org_students')
        .select('linked_user_id, full_name, avatar_url')
        .eq('org_id', orgId)
        .in('linked_user_id', userIds);

      if (orgStudentsError) console.error('Error fetching org_students:', orgStudentsError);

      // Map profiles and org_students to members
      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const orgStudentsMap = new Map(orgStudents?.map(s => [s.linked_user_id, s]) || []);
      
      return groupMembers.map(member => {
        const profile = profilesMap.get(member.user_id);
        const orgStudent = orgStudentsMap.get(member.user_id);
        
        return {
          ...member,
          profiles: {
            display_name: orgStudent?.full_name || profile?.full_name || profile?.display_name,
            full_name: orgStudent?.full_name || profile?.full_name,
            email: profile?.email,
            avatar_url: orgStudent?.avatar_url || profile?.avatar_url,
          }
        };
      }) as GroupMember[];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch available students (not in this group)
  const { data: availableStudents = [], isLoading: loadingAvailable } = useQuery({
    queryKey: ['org-available-students', orgId, groupId],
    enabled: !!orgId && !!groupId,
    queryFn: async () => {
      if (!orgId || !groupId) return [];

      // Get all students in the organization
      const { data: orgMembers, error: membersError } = await supabase
        .from('org_members')
        .select('user_id, role, status')
        .eq('org_id', orgId)
        .eq('role', 'student')
        .eq('status', 'active');

      if (membersError) throw membersError;

      // Get students already in this group
      const { data: groupMembers, error: groupError } = await supabase
        .from('org_group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (groupError) throw groupError;

      const groupMemberIds = new Set(groupMembers?.map(m => m.user_id) || []);

      // Filter out students already in the group
      const availableUserIds = orgMembers
        ?.filter(member => !groupMemberIds.has(member.user_id))
        .map(m => m.user_id) || [];

      if (availableUserIds.length === 0) return [];

      // Fetch profiles for available students
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, email, avatar_url')
        .in('id', availableUserIds);

      if (profilesError) throw profilesError;

      // Fetch org_students data (legacy system with student names)
      const { data: orgStudents, error: orgStudentsError } = await supabase
        .from('org_students')
        .select('linked_user_id, full_name')
        .eq('org_id', orgId)
        .in('linked_user_id', availableUserIds);

      if (orgStudentsError) console.error('Error fetching org_students:', orgStudentsError);

      // Create maps for easy lookup
      const orgMembersMap = new Map(orgMembers?.map(m => [m.user_id, m]) || []);
      const orgStudentsMap = new Map(orgStudents?.map(s => [s.linked_user_id, s]) || []);
      
      const available = profiles?.map(profile => {
        const member = orgMembersMap.get(profile.id);
        const orgStudent = orgStudentsMap.get(profile.id);
        
        // Prefer org_students name, fallback to profile
        const name = orgStudent?.full_name || profile.full_name || profile.display_name;
        
        return {
          user_id: profile.id,
          display_name: name,
          full_name: name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          role: member?.role || 'student',
          status: member?.status || 'active'
        };
      }) || [];

      return available as AvailableStudent[];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Add member to group
  const addMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('org_group_members')
        .insert({
          group_id: groupId!,
          user_id: userId,
          added_by: user.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['org-available-students'] });
      queryClient.invalidateQueries({ queryKey: ['org-groups'] });
      toast({
        title: "Success",
        description: "Member added to group successfully.",
      });
    },
    onError: (error) => {
      console.error('Error adding member to group:', error);
      toast({
        title: "Error",
        description: "Failed to add member to group.",
        variant: "destructive",
      });
    },
  });

  // Bulk add members to group
  const bulkAddMembersMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const { data: user } = await supabase.auth.getUser();
      
      const inserts = userIds.map(userId => ({
        group_id: groupId!,
        user_id: userId,
        added_by: user.user?.id,
      }));
      
      const { data, error } = await supabase
        .from('org_group_members')
        .insert(inserts)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['org-group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['org-available-students'] });
      queryClient.invalidateQueries({ queryKey: ['org-groups'] });
      toast({
        title: "Success",
        description: `${data.length} member${data.length > 1 ? 's' : ''} added to group successfully.`,
      });
    },
    onError: (error) => {
      console.error('Error adding members to group:', error);
      toast({
        title: "Error",
        description: "Failed to add members to group.",
        variant: "destructive",
      });
    },
  });

  // Remove member from group
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('org_group_members')
        .delete()
        .eq('group_id', groupId!)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['org-available-students'] });
      queryClient.invalidateQueries({ queryKey: ['org-groups'] });
      toast({
        title: "Success",
        description: "Member removed from group successfully.",
      });
    },
    onError: (error) => {
      console.error('Error removing member from group:', error);
      toast({
        title: "Error",
        description: "Failed to remove member from group.",
        variant: "destructive",
      });
    },
  });

  return {
    members,
    availableStudents,
    isLoading: loadingMembers || loadingAvailable,
    error,
    addMember: addMemberMutation.mutate,
    bulkAddMembers: bulkAddMembersMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    isAddingMember: addMemberMutation.isPending,
    isBulkAddingMembers: bulkAddMembersMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
  };
}
