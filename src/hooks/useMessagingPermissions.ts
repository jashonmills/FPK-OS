import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MentionableUser } from '@/hooks/useOrgMembersForMention';

interface UseMessagingPermissionsReturn {
  allowedRecipients: MentionableUser[];
  canMessageUser: (targetUserId: string, targetRole: string) => boolean;
  isLoading: boolean;
  currentUserRole: string;
}

/**
 * Hook for permission-aware messaging recipient filtering.
 * Implements the "Managed Trust" model:
 * - Admins/Owners can message anyone
 * - Educators can message all students and other educators
 * - Students can message educators OR other students in shared messaging-enabled groups
 */
export function useMessagingPermissions(orgId: string | undefined): UseMessagingPermissionsReturn {
  const [allowedRecipients, setAllowedRecipients] = useState<MentionableUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>('none');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchAllowedRecipients = useCallback(async () => {
    if (!orgId || !user?.id) return;

    try {
      setIsLoading(true);

      // Get current user's role in org
      const { data: roleData } = await supabase
        .rpc('get_org_user_role', { p_user_id: user.id, p_org_id: orgId });
      
      const userRole = roleData || 'none';
      setCurrentUserRole(userRole);

      // Fetch all org members
      const { data: orgMembers, error: membersError } = await supabase
        .from('org_members')
        .select('user_id, role')
        .eq('org_id', orgId)
        .eq('status', 'active');

      if (membersError) throw membersError;

      // Get profiles for all members
      const memberIds = orgMembers?.map(m => m.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .in('id', memberIds);

      // Fetch org_students with linked accounts
      const { data: orgStudents } = await supabase
        .from('org_students')
        .select('linked_user_id, full_name')
        .eq('org_id', orgId)
        .not('linked_user_id', 'is', null);

      // Get student profiles
      const studentUserIds = orgStudents?.filter(s => s.linked_user_id).map(s => s.linked_user_id!) || [];
      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .in('id', studentUserIds);

      // Build member map with roles
      const memberRoleMap = new Map<string, string>();
      orgMembers?.forEach(m => memberRoleMap.set(m.user_id, m.role));
      studentUserIds.forEach(id => {
        if (!memberRoleMap.has(id)) {
          memberRoleMap.set(id, 'student');
        }
      });

      // Build all potential recipients (excluding current user)
      const allMembers: MentionableUser[] = [];

      // Add staff members
      profiles?.forEach(profile => {
        if (profile.id !== user.id) {
          allMembers.push({
            id: profile.id,
            full_name: profile.full_name || profile.email || 'Unknown',
            avatar_url: profile.avatar_url || undefined,
            email: profile.email || undefined,
            role: memberRoleMap.get(profile.id) || 'member'
          });
        }
      });

      // Add students (avoiding duplicates)
      studentProfiles?.forEach(profile => {
        if (profile.id !== user.id && !allMembers.some(m => m.id === profile.id)) {
          allMembers.push({
            id: profile.id,
            full_name: profile.full_name || profile.email || 'Unknown',
            avatar_url: profile.avatar_url || undefined,
            email: profile.email || undefined,
            role: 'student'
          });
        }
      });

      // Apply permission filtering based on current user's role
      let filteredMembers: MentionableUser[] = [];

      if (userRole === 'owner' || userRole === 'admin') {
        // Admins/Owners can message anyone
        filteredMembers = allMembers;
      } else if (['instructor', 'instructor_aide'].includes(userRole)) {
        // Educators can message everyone in their org
        filteredMembers = allMembers;
      } else if (userRole === 'student') {
        // Students can message:
        // 1. Educators (owner, admin, instructor, instructor_aide)
        // 2. Other students in shared messaging-enabled groups
        const educators = allMembers.filter(m => 
          ['owner', 'admin', 'instructor', 'instructor_aide'].includes(m.role || '')
        );

        // Check which students can be messaged
        const otherStudents = allMembers.filter(m => m.role === 'student');
        const allowedStudents: MentionableUser[] = [];

        for (const student of otherStudents) {
          const { data: canMessage } = await supabase
            .rpc('can_students_message', {
              p_org_id: orgId,
              p_student1_id: user.id,
              p_student2_id: student.id
            });

          if (canMessage) {
            allowedStudents.push(student);
          }
        }

        filteredMembers = [...educators, ...allowedStudents];
      } else {
        // Unknown role - show no one
        filteredMembers = [];
      }

      setAllowedRecipients(filteredMembers);
    } catch (error) {
      console.error('Error fetching messaging permissions:', error);
      setAllowedRecipients([]);
    } finally {
      setIsLoading(false);
    }
  }, [orgId, user?.id]);

  useEffect(() => {
    fetchAllowedRecipients();
  }, [fetchAllowedRecipients]);

  const canMessageUser = useCallback((targetUserId: string, targetRole: string): boolean => {
    // Check if target is in allowed recipients
    return allowedRecipients.some(r => r.id === targetUserId);
  }, [allowedRecipients]);

  return {
    allowedRecipients,
    canMessageUser,
    isLoading,
    currentUserRole
  };
}
