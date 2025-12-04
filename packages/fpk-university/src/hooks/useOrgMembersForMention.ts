import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MentionableUser {
  id: string;
  full_name: string;
  avatar_url?: string;
  email?: string;
  role?: string;
}

export function useOrgMembersForMention(orgId: string | undefined, searchQuery?: string) {
  const [members, setMembers] = useState<MentionableUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchMembers = useCallback(async () => {
    if (!orgId) return;

    try {
      setIsLoading(true);

      // Fetch org members
      const { data: orgMembers, error } = await supabase
        .from('org_members')
        .select('user_id, role')
        .eq('org_id', orgId)
        .eq('status', 'active');

      if (error) throw error;

      // Get user profiles
      const userIds = orgMembers?.map(m => m.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .in('id', userIds);

      // Also fetch org_students
      const { data: orgStudents } = await supabase
        .from('org_students')
        .select('linked_user_id, full_name')
        .eq('org_id', orgId)
        .not('linked_user_id', 'is', null);

      // Get student profiles
      const studentUserIds = orgStudents?.filter(s => s.linked_user_id).map(s => s.linked_user_id) || [];
      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .in('id', studentUserIds);

      // Combine members
      const allMembers: MentionableUser[] = [];

      // Add org members (staff)
      orgMembers?.forEach(member => {
        const profile = profiles?.find(p => p.id === member.user_id);
        if (profile && profile.id !== user?.id) {
          allMembers.push({
            id: profile.id,
            full_name: profile.full_name || profile.email || 'Unknown',
            avatar_url: profile.avatar_url || undefined,
            email: profile.email || undefined,
            role: member.role
          });
        }
      });

      // Add students
      studentProfiles?.forEach(profile => {
        if (profile.id !== user?.id && !allMembers.some(m => m.id === profile.id)) {
          allMembers.push({
            id: profile.id,
            full_name: profile.full_name || profile.email || 'Unknown',
            avatar_url: profile.avatar_url || undefined,
            email: profile.email || undefined,
            role: 'student'
          });
        }
      });

      // Filter by search query if provided
      let filteredMembers = allMembers;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredMembers = allMembers.filter(m =>
          m.full_name.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query)
        );
      }

      setMembers(filteredMembers);
    } catch (error) {
      console.error('Error fetching members for mention:', error);
    } finally {
      setIsLoading(false);
    }
  }, [orgId, user?.id, searchQuery]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, isLoading, refetch: fetchMembers };
}
