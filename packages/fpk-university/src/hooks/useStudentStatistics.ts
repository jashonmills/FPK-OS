import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StudentStatistics {
  coursesAssigned: number;
  coursesCompleted: number;
  averageGrade: number;
  studyHours: number;
  goalsAssigned: number;
  goalsCompleted: number;
  notesCount: number;
  documentsCount: number;
}

/**
 * Hook to fetch comprehensive statistics for a student profile
 */
export function useStudentStatistics(studentId?: string, linkedUserId?: string, orgId?: string) {
  return useQuery({
    queryKey: ['student-statistics', studentId, linkedUserId, orgId],
    queryFn: async () => {
      if (!studentId) {
        return {
          coursesAssigned: 0,
          coursesCompleted: 0,
          averageGrade: 0,
          studyHours: 0,
          goalsAssigned: 0,
          goalsCompleted: 0,
          notesCount: 0,
          documentsCount: 0,
        };
      }

      // Fetch course assignments
      const { data: courses } = await supabase
        .from('student_course_assignments')
        .select('status, progress_percentage')
        .eq('student_id', studentId);

      const coursesAssigned = courses?.length || 0;
      const coursesCompleted = courses?.filter(c => c.status === 'completed').length || 0;
      const averageProgress = courses && courses.length > 0
        ? courses.reduce((sum, c) => sum + (c.progress_percentage || 0), 0) / courses.length
        : 0;

      // Fetch goals
      const { data: goals } = await supabase
        .from('org_goals')
        .select('status')
        .eq('student_id', studentId);

      const goalsAssigned = goals?.length || 0;
      const goalsCompleted = goals?.filter(g => g.status === 'completed').length || 0;

      // Fetch notes
      const { data: notes } = await supabase
        .from('student_notes')
        .select('id')
        .eq('student_id', linkedUserId || studentId);

      const notesCount = notes?.length || 0;

      // Documents count - currently not tracking in a separate table
      const documentsCount = 0;

      // TODO: Calculate actual study hours from analytics when available
      const studyHours = 0;

      return {
        coursesAssigned,
        coursesCompleted,
        averageGrade: Math.round(averageProgress),
        studyHours,
        goalsAssigned,
        goalsCompleted,
        notesCount,
        documentsCount,
      };
    },
    enabled: !!studentId,
    staleTime: 1000 * 60, // 1 minute
  });
}
