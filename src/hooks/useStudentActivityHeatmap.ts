import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface StudentActivityData {
  student_id: string;
  student_name: string;
  student_email: string;
  avatar_url?: string;
  activity_status: 'active' | 'caution' | 'struggling';
  last_activity_at?: string;
  current_lesson_id?: string;
  progress_velocity: number;
  engagement_score: number;
  time_spent_today_minutes: number;
}

export const useStudentActivityHeatmap = (orgId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-activity-heatmap', orgId],
    queryFn: async (): Promise<StudentActivityData[]> => {
      if (!user?.id || !orgId) {
        return [];
      }

      try {
        const { data, error } = await supabase.rpc(
          'get_org_student_activity_heatmap',
          { p_org_id: orgId }
        );

        if (error) throw error;

        return (data || []).map((student: any) => ({
          student_id: student.student_id,
          student_name: student.student_name,
          student_email: student.student_email,
          avatar_url: student.avatar_url,
          activity_status: student.activity_status,
          last_activity_at: student.last_activity_at,
          current_lesson_id: student.current_lesson_id,
          progress_velocity: student.progress_velocity,
          engagement_score: student.engagement_score,
          time_spent_today_minutes: student.time_spent_today_minutes,
        }));
      } catch (err) {
        console.error('Error fetching student activity heatmap:', err);
        return [];
      }
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refetch every 30 seconds for real-time updates
    enabled: !!user?.id && !!orgId,
  });
};