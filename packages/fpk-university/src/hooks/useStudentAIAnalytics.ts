import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface StudentAIStats {
  totalAITasks: number;
  approvedCount: number;
  pendingCount: number;
  learningProgress: number;
}

export interface RecentActivity {
  id: string;
  task: string;
  subject: string;
  status: 'approved' | 'pending' | 'completed';
  time: string;
}

export interface AIRequest {
  id: string;
  task: string;
  category: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  priority: string;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  subject: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
}

export function useStudentAIAnalytics(orgId?: string) {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentAIStats>({
    totalAITasks: 0,
    approvedCount: 0,
    pendingCount: 0,
    learningProgress: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [requests, setRequests] = useState<AIRequest[]>([]);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch AI tool sessions count
      let sessionsQuery = supabase
        .from('ai_tool_sessions')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      // Fetch governance approvals
      let approvalsQuery = supabase
        .from('ai_governance_approvals')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      // Fetch in-progress courses for recommendations
      let coursesQuery = supabase
        .from('interactive_course_enrollments')
        .select('course_id, course_title, completion_percentage, total_time_spent_minutes')
        .eq('user_id', user.id)
        .lt('completion_percentage', 100)
        .order('last_accessed_at', { ascending: false })
        .limit(3);

      // Fetch overall learning progress
      let progressQuery = supabase
        .from('interactive_course_enrollments')
        .select('completion_percentage')
        .eq('user_id', user.id);

      if (orgId) {
        sessionsQuery = sessionsQuery.eq('org_id', orgId);
        approvalsQuery = approvalsQuery.eq('org_id', orgId);
        coursesQuery = coursesQuery.eq('org_id', orgId);
        progressQuery = progressQuery.eq('org_id', orgId);
      }

      const [sessionsResult, approvalsResult, coursesResult, progressResult] = await Promise.all([
        sessionsQuery,
        approvalsQuery,
        coursesQuery,
        progressQuery,
      ]);

      // Calculate stats
      const totalAITasks = sessionsResult.count || 0;
      const approvals = approvalsResult.data || [];
      const approvedCount = approvals.filter(a => a.status === 'approved').length;
      const pendingCount = approvals.filter(a => a.status === 'pending').length;

      // Calculate average learning progress
      const enrollments = progressResult.data || [];
      const learningProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.completion_percentage || 0), 0) / enrollments.length)
        : 0;

      setStats({
        totalAITasks,
        approvedCount,
        pendingCount,
        learningProgress,
      });

      // Format requests
      setRequests(
        approvals.map(a => ({
          id: a.id,
          task: a.task,
          category: a.category,
          status: a.status as 'approved' | 'pending' | 'rejected',
          date: new Date(a.requested_at).toLocaleDateString(),
          priority: a.priority || 'normal',
        }))
      );

      // Format recent activities from sessions
      const recentSessionsQuery = supabase
        .from('ai_tool_sessions')
        .select('id, tool_id, started_at, metadata')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(5);

      const recentSessionsResult = await recentSessionsQuery;
      const recentSessions = recentSessionsResult.data || [];

      const toolNameMap: Record<string, string> = {
        'ai-personal-tutor': 'AI Personal Tutor',
        'math-solver': 'Math Problem Solver',
        'essay-coach': 'Essay Writing Helper',
        'code-companion': 'Code Learning',
        'language-practice': 'Language Practice',
        'research-assistant': 'Research Assistant',
      };

      const subjectMap: Record<string, string> = {
        'ai-personal-tutor': 'General',
        'math-solver': 'Mathematics',
        'essay-coach': 'English',
        'code-companion': 'Computer Science',
        'language-practice': 'Languages',
        'research-assistant': 'Research',
      };

      setRecentActivities(
        recentSessions.map(s => ({
          id: s.id,
          task: toolNameMap[s.tool_id] || s.tool_id,
          subject: subjectMap[s.tool_id] || 'General',
          status: 'completed' as const,
          time: formatTimeAgo(new Date(s.started_at)),
        }))
      );

      // Format course recommendations
      const courses = coursesResult.data || [];
      setRecommendations(
        courses.map(c => ({
          id: c.course_id,
          title: c.course_title || c.course_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          subject: getCourseSubject(c.course_id),
          duration: `${Math.max(5, Math.round((c.total_time_spent_minutes || 0) / 60 * 10) / 10 || 15)} min`,
          difficulty: getCourseDifficulty(c.completion_percentage || 0),
          progress: c.completion_percentage || 0,
        }))
      );
    } catch (error) {
      console.error('Error fetching student AI analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id, orgId]);

  return {
    stats,
    recentActivities,
    requests,
    recommendations,
    isLoading,
    refetch: fetchStats,
  };
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function getCourseSubject(courseId: string): string {
  const id = courseId.toLowerCase();
  if (id.includes('math') || id.includes('algebra') || id.includes('geometry') || id.includes('calculus')) return 'Math';
  if (id.includes('english') || id.includes('essay') || id.includes('writing') || id.includes('reading')) return 'English';
  if (id.includes('code') || id.includes('programming') || id.includes('react')) return 'Coding';
  if (id.includes('science') || id.includes('physics') || id.includes('chemistry') || id.includes('biology')) return 'Science';
  if (id.includes('history') || id.includes('social')) return 'History';
  return 'General';
}

function getCourseDifficulty(progress: number): 'Easy' | 'Medium' | 'Hard' {
  if (progress > 50) return 'Easy';
  if (progress > 20) return 'Medium';
  return 'Hard';
}
