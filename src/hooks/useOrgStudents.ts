import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OrgRole } from '@/lib/org/permissions';

export interface OrgStudent {
  id: string;
  org_id: string;
  full_name: string;
  student_email?: string;
  grade_level?: string;
  student_id?: string;
  date_of_birth?: string;
  parent_email?: string;
  emergency_contact?: Record<string, any>;
  notes?: string;
  status: 'active' | 'inactive' | 'graduated';
  linked_user_id?: string;
  avatar_url?: string;
  pin_hash?: string;
  activation_token?: string;
  activation_status?: 'pending' | 'activated' | 'expired';
  token_expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrgStudentData {
  full_name: string;
  student_email?: string;
  grade_level?: string;
  student_id?: string;
  date_of_birth?: string;
  parent_email?: string;
  emergency_contact?: Record<string, any>;
  notes?: string;
}

interface UseOrgStudentsOptions {
  searchQuery?: string;
  effectiveRole?: OrgRole;
  currentUserId?: string;
}

export function useOrgStudents(orgId: string, searchQueryOrOptions?: string | UseOrgStudentsOptions) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Handle both old API (searchQuery string) and new API (options object)
  const options: UseOrgStudentsOptions = typeof searchQueryOrOptions === 'string' 
    ? { searchQuery: searchQueryOrOptions }
    : searchQueryOrOptions || {};
  
  const { searchQuery, effectiveRole, currentUserId } = options;
  
  // Determine if we should scope to assigned groups only (instructor/instructor_aide)
  const shouldScopeToAssigned = effectiveRole && ['instructor', 'instructor_aide'].includes(effectiveRole);

  const { data: students = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-students', orgId, searchQuery, effectiveRole, currentUserId],
    queryFn: async () => {
      try {
        console.log('🔄 [useOrgStudents] Fetching students for org:', orgId, 'role:', effectiveRole);
        
        // If instructor/aide, first get the groups they created and the students in those groups
        let allowedStudentUserIds: Set<string> | null = null;
        
        if (shouldScopeToAssigned && currentUserId) {
          console.log('🔒 [useOrgStudents] Scoping to assigned groups for user:', currentUserId);
          
          // Get groups created by this instructor
          const { data: myGroups, error: groupsError } = await supabase
            .from('org_groups')
            .select('id')
            .eq('org_id', orgId)
            .eq('created_by', currentUserId);
          
          if (groupsError) {
            console.error('❌ [useOrgStudents] Error fetching instructor groups:', groupsError);
            throw groupsError;
          }
          
          const groupIds = (myGroups || []).map(g => g.id);
          console.log('📁 [useOrgStudents] Instructor groups:', groupIds.length);
          
          if (groupIds.length === 0) {
            // Instructor has no groups, return empty list
            console.log('⚠️ [useOrgStudents] No groups found for instructor, returning empty list');
            return [];
          }
          
          // Get students in those groups
          const { data: groupMembers, error: membersError } = await supabase
            .from('org_group_members')
            .select('user_id')
            .in('group_id', groupIds);
          
          if (membersError) {
            console.error('❌ [useOrgStudents] Error fetching group members:', membersError);
            throw membersError;
          }
          
          allowedStudentUserIds = new Set((groupMembers || []).map(m => m.user_id).filter(Boolean));
          console.log('👥 [useOrgStudents] Allowed student user IDs:', allowedStudentUserIds.size);
          
          if (allowedStudentUserIds.size === 0) {
            // No students in instructor's groups
            console.log('⚠️ [useOrgStudents] No students in instructor groups, returning empty list');
            return [];
          }
        }
        
        // Fetch profile-only students from org_students table
        let orgStudentsQuery = supabase
          .from('org_students')
          .select('*')
          .eq('org_id', orgId)
          .order('created_at', { ascending: false });

        if (searchQuery) {
          orgStudentsQuery = orgStudentsQuery.or(
            `full_name.ilike.%${searchQuery}%,student_id.ilike.%${searchQuery}%,parent_email.ilike.%${searchQuery}%`
          );
        }

        const { data: orgStudentsData, error: orgStudentsError } = await orgStudentsQuery;

        if (orgStudentsError) {
          console.error('❌ [useOrgStudents] Error fetching org students:', orgStudentsError);
          throw orgStudentsError;
        }

        console.log('✅ [useOrgStudents] Fetched org_students:', orgStudentsData?.length || 0);

        // Fetch students with active accounts from org_members
        const { data: orgMembersData, error: orgMembersError } = await supabase
          .from('org_members')
          .select('id, user_id, org_id, role, status, joined_at')
          .eq('org_id', orgId)
          .eq('role', 'student')
          .order('joined_at', { ascending: false});

        if (orgMembersError) {
          console.error('❌ [useOrgStudents] Error fetching org members:', orgMembersError);
          throw orgMembersError;
        }

        console.log('✅ [useOrgStudents] Fetched org_members:', orgMembersData?.length || 0);

        // Get student data with email fallback
        const { data: studentActivityData, error: activityError } = await supabase
          .rpc('get_org_student_activity_heatmap', { p_org_id: orgId });

        if (activityError) {
          console.warn('⚠️ [useOrgStudents] Error fetching student activity data:', activityError);
        }

        console.log('✅ [useOrgStudents] Fetched activity data for', studentActivityData?.length || 0, 'students');

        // Create a map of user_id to student info from activity data
        const activityMap = new Map(
          (studentActivityData || []).map((s: any) => [s.student_id, {
            name: s.student_name || 'Unknown Student',
            email: s.student_email
          }])
        );

        // Fetch avatar URLs from profiles table for all members
        const memberUserIds = (orgMembersData || []).map(m => m.user_id).filter(Boolean);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, avatar_url')
          .in('id', memberUserIds);

        const avatarMap = new Map(
          (profilesData || []).map((p: any) => [p.id, p.avatar_url])
        );

        console.log('✅ [useOrgStudents] Fetched avatars for', profilesData?.length || 0, 'profiles');

        // For each org_member, check if they have a profile in org_students
        const memberStudents: OrgStudent[] = [];
        
        console.log('🔄 [useOrgStudents] Processing', orgMembersData?.length || 0, 'org_members...');
        
        for (const member of (orgMembersData || [])) {
          if (!member || !member.user_id) {
            console.warn('⚠️ [useOrgStudents] Skipping invalid member:', member);
            continue;
          }
          // Check if this user has a profile in org_students
          const existingProfile = (orgStudentsData || []).find(
            (s: any) => s.linked_user_id === member.user_id
          );
          
          if (existingProfile) {
            // Use the org_students profile data, add avatar from profiles
            memberStudents.push({
              ...existingProfile,
              avatar_url: existingProfile.avatar_url || avatarMap.get(member.user_id),
              status: existingProfile.status as 'active' | 'inactive' | 'graduated',
              activation_status: existingProfile.activation_status as 'pending' | 'activated' | 'expired' | undefined,
              emergency_contact: existingProfile.emergency_contact as Record<string, any> | undefined,
            });
          } else {
            // Student has account but no profile yet - show basic info
            const activityInfo = activityMap.get(member.user_id);
            memberStudents.push({
              id: `member-${member.id}`, // Temporary ID marker
              org_id: member.org_id || orgId,
              full_name: activityInfo?.name || activityInfo?.email || 'Unknown Student',
              student_email: activityInfo?.email,
              avatar_url: avatarMap.get(member.user_id),
              grade_level: undefined,
              student_id: undefined,
              date_of_birth: undefined,
              parent_email: activityInfo?.email,
              emergency_contact: undefined,
              notes: undefined,
              status: member.status === 'active' ? 'active' : 'inactive',
              linked_user_id: member.user_id,
              created_by: member.user_id,
              created_at: member.joined_at || new Date().toISOString(),
              updated_at: member.joined_at || new Date().toISOString(),
            });
          }
        }

        console.log('✅ [useOrgStudents] Processed', memberStudents.length, 'member students');

        // Filter member students by search query if provided
        const filteredMemberStudents = searchQuery
          ? memberStudents.filter((student) =>
              student.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : memberStudents;

        // Get students from org_students that aren't already in memberStudents
        const existingMemberUserIds = new Set(memberStudents.map(s => s.linked_user_id).filter(Boolean));
        const remainingOrgStudents = (orgStudentsData || [])
          .filter((s: any) => !s.linked_user_id || !existingMemberUserIds.has(s.linked_user_id))
          .map((student: any) => ({
            ...student,
            status: student.status as 'active' | 'inactive' | 'graduated',
            activation_status: student.activation_status as 'pending' | 'activated' | 'expired' | undefined,
            emergency_contact: student.emergency_contact as Record<string, any> | undefined,
          }));

        console.log('✅ [useOrgStudents] Returning', remainingOrgStudents.length + filteredMemberStudents.length, 'total students');

        // Combine: remaining org_students first, then member students
        let allStudents = [...remainingOrgStudents, ...filteredMemberStudents];
        
        // If scoped to assigned, filter to only allowed students
        if (allowedStudentUserIds) {
          allStudents = allStudents.filter(student => {
            // Include if student's linked_user_id is in allowed set
            if (student.linked_user_id && allowedStudentUserIds!.has(student.linked_user_id)) {
              return true;
            }
            // For profile-only students (no linked_user_id), check if created_by matches current user
            // This allows instructors to see students they created even if not in a group yet
            if (!student.linked_user_id && student.created_by === currentUserId) {
              return true;
            }
            return false;
          });
          console.log('🔒 [useOrgStudents] After scoping filter:', allStudents.length, 'students');
        }
        
        return allStudents;
      } catch (error) {
        console.error('🔴 [useOrgStudents] Fatal error in queryFn:', error);
        throw error;
      }
    },
    enabled: !!orgId && (!shouldScopeToAssigned || !!currentUserId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  const createStudentMutation = useMutation({
    mutationFn: async (studentData: CreateOrgStudentData) => {
      const { data, error } = await supabase
        .from('org_students')
        .insert({
          ...studentData,
          org_id: orgId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-students', orgId] });
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error creating student:', error);
      
      let errorMessage = "Failed to add student";
      
      if (error.code === '23505' && error.message?.includes('unique_student_id_per_org')) {
        errorMessage = "A student with this Student ID already exists in your organization. Please use a different Student ID or leave it blank.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (updateData: Partial<OrgStudent> & { id: string }) => {
      const { id, linked_user_id, org_id: studentOrgId, created_by, created_at, updated_at, ...updates } = updateData;
      
      console.log('Updating student:', { id, linked_user_id, updates });
      
      // Check if this is a member-student (has linked_user_id)
      if (linked_user_id) {
        // Check if profile exists in org_students
        const { data: existingProfile } = await supabase
          .from('org_students')
          .select('id')
          .eq('org_id', orgId)
          .eq('linked_user_id', linked_user_id)
          .maybeSingle();
        
        if (existingProfile) {
          // Update existing profile
          const { data, error } = await supabase
            .from('org_students')
            .update(updates)
            .eq('id', existingProfile.id)
            .select()
            .single();

          if (error) {
            console.error('Update existing profile error:', error);
            throw error;
          }
          
          console.log('Updated existing profile:', data);
          return data;
        } else {
          // Create new profile for this member
          const { data: currentUser } = await supabase.auth.getUser();
          
          const { data, error } = await supabase
            .from('org_students')
            .insert({
              org_id: orgId,
              linked_user_id: linked_user_id,
              created_by: currentUser.user?.id || linked_user_id,
              status: 'active',
              full_name: updates.full_name || '',
              grade_level: updates.grade_level || null,
              student_id: updates.student_id || null,
              date_of_birth: updates.date_of_birth || null,
              parent_email: updates.parent_email || null,
              emergency_contact: updates.emergency_contact || null,
              notes: updates.notes || null,
            } as any)
            .select()
            .single();

          if (error) {
            console.error('Create new profile error:', error);
            throw error;
          }
          
          console.log('Created new profile:', data);
          return data;
        }
      } else {
        // Profile-only student (no account) - direct update
        const { data, error } = await supabase
          .from('org_students')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Update profile-only error:', error);
          throw error;
        }
        
        console.log('Updated profile-only:', data);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-students', orgId] });
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update student",
        variant: "destructive",
      });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      // Check if this is a member-only student (no org_students profile)
      if (studentId.startsWith('member-')) {
        // Extract the real org_members.id
        const memberId = studentId.replace('member-', '');
        
        // Delete from org_members table
        const { error } = await supabase
          .from('org_members')
          .delete()
          .eq('id', memberId);

        if (error) throw error;
      } else {
        // Regular student with org_students profile
        const { error } = await supabase
          .from('org_students')
          .delete()
          .eq('id', studentId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-students', orgId] });
      toast({
        title: "Success",
        description: "Student removed successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove student",
        variant: "destructive",
      });
    },
  });

  return {
    students,
    isLoading,
    error,
    refetch,
    createStudent: createStudentMutation.mutate,
    createStudentAsync: createStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,
    isCreating: createStudentMutation.isPending,
    isUpdating: updateStudentMutation.isPending,
    isDeleting: deleteStudentMutation.isPending,
  };
}