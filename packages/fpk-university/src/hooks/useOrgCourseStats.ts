import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CourseStat {
  courseId: string;
  courseName: string;
  sessions7Days: number;
  sessions30Days: number;
  enrollmentCount: number;
  avgCompletion: number;
  activeStudents: number;
}

export interface OrgCourseStats {
  summary: {
    totalSessions7Days: number;
    totalSessions30Days: number;
    uniqueActiveStudents: number;
    avgCompletionRate: number;
    totalLearningMinutes: number;
    mostActiveCourse: string | null;
  };
  byCourse: CourseStat[];
}

export function useOrgCourseStats(orgId?: string) {
  return useQuery({
    queryKey: ['org-course-stats', orgId],
    queryFn: async (): Promise<OrgCourseStats> => {
      if (!orgId) {
        return {
          summary: {
            totalSessions7Days: 0,
            totalSessions30Days: 0,
            uniqueActiveStudents: 0,
            avgCompletionRate: 0,
            totalLearningMinutes: 0,
            mostActiveCourse: null,
          },
          byCourse: [],
        };
      }

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch sessions for the last 30 days
      const { data: sessions, error: sessionsError } = await supabase
        .from('interactive_course_sessions')
        .select('course_id, user_id, session_start, duration_seconds')
        .eq('org_id', orgId)
        .gte('session_start', thirtyDaysAgo);

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        throw sessionsError;
      }

      // Fetch enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('interactive_course_enrollments')
        .select('course_id, user_id, completion_percentage')
        .eq('org_id', orgId);

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        throw enrollmentsError;
      }

      // Fetch course names
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title');

      const courseNameMap = new Map(courses?.map(c => [c.id, c.title]) || []);

      // Calculate stats
      const sessions7Days = sessions?.filter(s => new Date(s.session_start) >= new Date(sevenDaysAgo)) || [];
      const sessions30Days = sessions || [];

      // Group by course
      const courseStatsMap = new Map<string, CourseStat>();

      // Initialize from enrollments
      enrollments?.forEach(e => {
        if (!courseStatsMap.has(e.course_id)) {
          courseStatsMap.set(e.course_id, {
            courseId: e.course_id,
            courseName: courseNameMap.get(e.course_id) || e.course_id,
            sessions7Days: 0,
            sessions30Days: 0,
            enrollmentCount: 0,
            avgCompletion: 0,
            activeStudents: 0,
          });
        }
        const stat = courseStatsMap.get(e.course_id)!;
        stat.enrollmentCount++;
        stat.avgCompletion += e.completion_percentage || 0;
      });

      // Add session counts
      sessions30Days.forEach(s => {
        if (!courseStatsMap.has(s.course_id)) {
          courseStatsMap.set(s.course_id, {
            courseId: s.course_id,
            courseName: courseNameMap.get(s.course_id) || s.course_id,
            sessions7Days: 0,
            sessions30Days: 0,
            enrollmentCount: 0,
            avgCompletion: 0,
            activeStudents: 0,
          });
        }
        const stat = courseStatsMap.get(s.course_id)!;
        stat.sessions30Days++;
        
        if (new Date(s.session_start) >= new Date(sevenDaysAgo)) {
          stat.sessions7Days++;
        }
      });

      // Calculate active students per course (7 days)
      const activeStudentsByCourse = new Map<string, Set<string>>();
      sessions7Days.forEach(s => {
        if (!activeStudentsByCourse.has(s.course_id)) {
          activeStudentsByCourse.set(s.course_id, new Set());
        }
        activeStudentsByCourse.get(s.course_id)!.add(s.user_id);
      });

      activeStudentsByCourse.forEach((students, courseId) => {
        const stat = courseStatsMap.get(courseId);
        if (stat) {
          stat.activeStudents = students.size;
        }
      });

      // Calculate averages
      courseStatsMap.forEach(stat => {
        if (stat.enrollmentCount > 0) {
          stat.avgCompletion = Math.round(stat.avgCompletion / stat.enrollmentCount);
        }
      });

      const byCourse = Array.from(courseStatsMap.values())
        .sort((a, b) => b.sessions7Days - a.sessions7Days);

      // Calculate summary
      const uniqueActiveStudents = new Set(sessions7Days.map(s => s.user_id)).size;
      const totalLearningMinutes = sessions30Days.reduce((acc, s) => acc + ((s.duration_seconds || 0) / 60), 0);
      const avgCompletionRate = enrollments && enrollments.length > 0
        ? Math.round(enrollments.reduce((acc, e) => acc + (e.completion_percentage || 0), 0) / enrollments.length)
        : 0;
      const mostActiveCourse = byCourse[0]?.courseName || null;

      return {
        summary: {
          totalSessions7Days: sessions7Days.length,
          totalSessions30Days: sessions30Days.length,
          uniqueActiveStudents,
          avgCompletionRate,
          totalLearningMinutes: Math.round(totalLearningMinutes),
          mostActiveCourse,
        },
        byCourse,
      };
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
