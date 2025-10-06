import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrgStudent {
  id: string;
  org_id: string;
  full_name: string;
  grade_level?: string;
  student_id?: string;
  date_of_birth?: string;
  parent_email?: string;
  emergency_contact?: Record<string, any>;
  notes?: string;
  status: 'active' | 'inactive' | 'graduated';
  linked_user_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrgStudentData {
  full_name: string;
  grade_level?: string;
  student_id?: string;
  date_of_birth?: string;
  parent_email?: string;
  emergency_contact?: Record<string, any>;
  notes?: string;
}

export function useOrgStudents(orgId: string, searchQuery?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-students', orgId, searchQuery],
    queryFn: async () => {
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
        console.error('Error fetching org students:', orgStudentsError);
        throw orgStudentsError;
      }

      // Fetch students with active accounts from org_members
      const { data: orgMembersData, error: orgMembersError } = await supabase
        .from('org_members')
        .select('id, user_id, org_id, role, status, joined_at')
        .eq('org_id', orgId)
        .eq('role', 'student')
        .order('joined_at', { ascending: false });

      if (orgMembersError) {
        console.error('Error fetching org members:', orgMembersError);
        throw orgMembersError;
      }

      // Fetch profiles for all member user IDs
      const memberUserIds = (orgMembersData || []).map((m: any) => m.user_id);
      let profilesData: any[] = [];
      
      if (memberUserIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, display_name')
          .in('id', memberUserIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Create a map of user_id to profile
      const profileMap = new Map(profilesData.map((p: any) => [p.id, p]));

      // Map org_members to OrgStudent format
      const memberStudents: OrgStudent[] = (orgMembersData || [])
        .map((member: any) => {
          const profile = profileMap.get(member.user_id);
          return {
            id: member.id,
            org_id: member.org_id,
            full_name: profile?.full_name || profile?.display_name || 'Unknown Student',
            grade_level: undefined,
            student_id: undefined,
            date_of_birth: undefined,
            parent_email: undefined,
            emergency_contact: undefined,
            notes: undefined,
            status: member.status === 'active' ? 'active' : 'inactive',
            linked_user_id: member.user_id, // Mark as linked
            created_by: member.user_id,
            created_at: member.joined_at,
            updated_at: member.joined_at,
          };
        });

      // Filter member students by search query if provided
      const filteredMemberStudents = searchQuery
        ? memberStudents.filter((student) =>
            student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : memberStudents;

      // Map org_students data to OrgStudent type
      const mappedOrgStudents: OrgStudent[] = (orgStudentsData || []).map((student: any) => ({
        ...student,
        emergency_contact: student.emergency_contact as Record<string, any> | undefined,
      }));

      // Combine both sources, prioritizing org_students (profile-only) first
      const allStudents = [...mappedOrgStudents, ...filteredMemberStudents];

      // Remove duplicates by linked_user_id (if a student exists in both tables, keep org_students version)
      const uniqueStudents = allStudents.reduce((acc, student) => {
        const existingIndex = acc.findIndex(
          (s) => s.linked_user_id && s.linked_user_id === student.linked_user_id
        );
        if (existingIndex === -1) {
          acc.push(student);
        }
        return acc;
      }, [] as OrgStudent[]);

      return uniqueStudents;
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<OrgStudent> & { id: string }) => {
      const { data, error } = await supabase
        .from('org_students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('org_students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;
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
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,
    isCreating: createStudentMutation.isPending,
    isUpdating: updateStudentMutation.isPending,
    isDeleting: deleteStudentMutation.isPending,
  };
}