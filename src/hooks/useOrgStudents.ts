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
      let query = supabase
        .from('org_students')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(
          `full_name.ilike.%${searchQuery}%,student_id.ilike.%${searchQuery}%,parent_email.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching org students:', error);
        throw error;
      }

      return data as OrgStudent[];
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