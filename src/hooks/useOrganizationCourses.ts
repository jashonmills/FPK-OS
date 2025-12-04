import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Course } from './useCourses';
import { NativeCourse } from './useNativeCourses';

export interface OrganizationCourseAssignment {
  id: string;
  organization_id: string;
  course_id?: string;
  native_course_id?: string;
  assigned_by: string;
  assigned_at: string;
  is_active: boolean;
  created_at: string;
}

export interface OrganizationCoursesResponse {
  globalCourses: Course[];
  nativeCourses: NativeCourse[];
  assignedCourses: Course[];
  assignedNativeCourses: NativeCourse[];
  organizationOwnedCourses: Course[];
  organizationOwnedNativeCourses: NativeCourse[];
}

// Hook to fetch courses available to an organization
export function useOrganizationCourses(organizationId: string) {
  return useQuery({
    queryKey: ['organization-courses', organizationId],
    queryFn: async (): Promise<OrganizationCoursesResponse> => {
      // Fetch global courses
      const { data: globalCourses, error: globalError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_visibility', 'global')
        .eq('status', 'published');

      if (globalError) throw globalError;

      // Fetch global native courses
      const { data: globalNativeCourses, error: globalNativeError } = await supabase
        .from('native_courses')
        .select('*')
        .eq('visibility', 'published')
        .or('course_visibility.is.null,course_visibility.eq.global');

      if (globalNativeError) throw globalNativeError;

      // Fetch assigned courses
      const { data: assignments, error: assignmentsError } = await supabase
        .from('organization_course_assignments')
        .select(`
          *,
          courses (*),
          native_courses (*)
        `)
        .eq('organization_id', organizationId)
        .eq('is_active', true);

      if (assignmentsError) throw assignmentsError;

      // Fetch organization-owned courses
      const { data: orgCourses, error: orgCoursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('organization_id', organizationId);

      if (orgCoursesError) throw orgCoursesError;

      const { data: orgNativeCourses, error: orgNativeCoursesError } = await supabase
        .from('native_courses')
        .select('*')
        .eq('organization_id', organizationId);

      if (orgNativeCoursesError) throw orgNativeCoursesError;

      const assignedCourses = assignments
        .filter(a => a.course_id && a.courses)
        .map(a => a.courses);

      const assignedNativeCourses = assignments
        .filter(a => a.native_course_id && a.native_courses)
        .map(a => a.native_courses);

      return {
        globalCourses: (globalCourses || []) as Course[],
        nativeCourses: (globalNativeCourses || []) as NativeCourse[],
        assignedCourses: (assignedCourses || []) as Course[],
        assignedNativeCourses: (assignedNativeCourses || []) as NativeCourse[],
        organizationOwnedCourses: (orgCourses || []) as Course[],
        organizationOwnedNativeCourses: (orgNativeCourses || []) as NativeCourse[],
      };
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch available courses that can be assigned to an organization
export function useAvailableCourses(organizationId: string) {
  return useQuery({
    queryKey: ['available-courses', organizationId],
    queryFn: async () => {
      // Get already assigned course IDs
      const { data: assignments } = await supabase
        .from('organization_course_assignments')
        .select('course_id, native_course_id')
        .eq('organization_id', organizationId)
        .eq('is_active', true);

      const assignedCourseIds = assignments?.map(a => a.course_id).filter(Boolean) || [];
      const assignedNativeCourseIds = assignments?.map(a => a.native_course_id).filter(Boolean) || [];

      // Fetch global courses not already assigned
      const { data: availableCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_visibility', 'global')
        .eq('status', 'published')
        .not('id', 'in', `(${assignedCourseIds.join(',')})`);

      if (coursesError) throw coursesError;

      // Fetch global native courses not already assigned
      const { data: availableNativeCourses, error: nativeCoursesError } = await supabase
        .from('native_courses')
        .select('*')
        .eq('visibility', 'published')
        .or('course_visibility.is.null,course_visibility.eq.global')
        .not('id', 'in', `(${assignedNativeCourseIds.join(',')})`);

      if (nativeCoursesError) throw nativeCoursesError;

      return {
        courses: (availableCourses || []) as Course[],
        nativeCourses: (availableNativeCourses || []) as NativeCourse[],
      };
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5,
  });
}

// Hook to manage course assignments
export function useOrganizationCourseAssignments() {
  const queryClient = useQueryClient();

  const assignCourse = useMutation({
    mutationFn: async ({
      organizationId,
      courseId,
      nativeCourseId,
    }: {
      organizationId: string;
      courseId?: string;
      nativeCourseId?: string;
    }) => {
      const { data, error } = await supabase
        .from('organization_course_assignments')
        .insert([{
          organization_id: organizationId,
          course_id: courseId,
          native_course_id: nativeCourseId,
          assigned_by: (await supabase.auth.getUser()).data.user?.id!,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization-courses', variables.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['available-courses', variables.organizationId] });
      toast.success('Course assigned successfully!');
    },
    onError: (error) => {
      console.error('Assignment error:', error);
      toast.error('Failed to assign course');
    },
  });

  const unassignCourse = useMutation({
    mutationFn: async ({
      organizationId,
      courseId,
      nativeCourseId,
    }: {
      organizationId: string;
      courseId?: string;
      nativeCourseId?: string;
    }) => {
      let query = supabase
        .from('organization_course_assignments')
        .update({ is_active: false })
        .eq('organization_id', organizationId);

      if (courseId) {
        query = query.eq('course_id', courseId);
      } else if (nativeCourseId) {
        query = query.eq('native_course_id', nativeCourseId);
      }

      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organization-courses', variables.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['available-courses', variables.organizationId] });
      toast.success('Course unassigned successfully!');
    },
    onError: (error) => {
      console.error('Unassignment error:', error);
      toast.error('Failed to unassign course');
    },
  });

  return {
    assignCourse,
    unassignCourse,
    isAssigning: assignCourse.isPending,
    isUnassigning: unassignCourse.isPending,
  };
}