import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgContext } from '@/components/organizations/OrgContext';

export interface OrgAnalytics {
  recentActivity: Array<{
    id: string;
    student_name: string;
    activity: string;
    timestamp: string;
    type: 'goal' | 'course' | 'note' | 'achievement';
  }>;
  topPerformers: Array<{
    student_name: string;
    completed_goals: number;
    progress_score: number;
  }>;
  progressMetrics: {
    totalLearningHours: number;
    averageProgress: number;
    coursesCompleted: number;
  };
}

export function useOrgAnalytics() {
  const { currentOrg } = useOrgContext();

  return useQuery({
    queryKey: ['org-analytics', currentOrg?.organization_id],
    queryFn: async (): Promise<OrgAnalytics> => {
      if (!currentOrg?.organization_id) {
        throw new Error('No organization selected');
      }

      const orgId = currentOrg.organization_id;

      // Get recent activity from goals and notes
      const { data: recentGoals, error: goalsError } = await supabase
        .from('org_goals')
        .select(`
          id,
          title,
          updated_at,
          student_id
        `)
        .eq('organization_id', orgId)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (goalsError) console.error('Goals error:', goalsError);

      const { data: recentNotes, error: notesError } = await supabase
        .from('org_notes')
        .select(`
          id,
          title,
          updated_at,
          student_id
        `)
        .eq('organization_id', orgId)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (notesError) console.error('Notes error:', notesError);

      // Combine and format recent activity
      const recentActivity = [
        ...(recentGoals || []).map(goal => ({
          id: goal.id,
          student_name: 'Student', // Placeholder - would need profile lookup
          activity: `Updated goal: ${goal.title}`,
          timestamp: goal.updated_at,
          type: 'goal' as const
        })),
        ...(recentNotes || []).map(note => ({
          id: note.id,
          student_name: 'Student', // Placeholder - would need profile lookup
          activity: `Note updated: ${note.title}`,
          timestamp: note.updated_at,
          type: 'note' as const
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

      // Get top performers based on completed goals
      const { data: performers, error: performersError } = await supabase
        .from('org_goals')
        .select(`
          student_id,
          status,
          progress_percentage
        `)
        .eq('organization_id', orgId);

      if (performersError) console.error('Performers error:', performersError);

      // Calculate top performers
      const performerStats: { [key: string]: { name: string; completed: number; totalProgress: number; count: number } } = {};
      
      (performers || []).forEach(goal => {
        const userId = goal.student_id;
        const name = 'Student'; // Placeholder - would need profile lookup
        
        if (!performerStats[userId]) {
          performerStats[userId] = { name, completed: 0, totalProgress: 0, count: 0 };
        }
        
        if (goal.status === 'completed') {
          performerStats[userId].completed++;
        }
        performerStats[userId].totalProgress += goal.progress_percentage || 0;
        performerStats[userId].count++;
      });

      const topPerformers = Object.values(performerStats)
        .map(stats => ({
          student_name: stats.name,
          completed_goals: stats.completed,
          progress_score: stats.count > 0 ? Math.round(stats.totalProgress / stats.count) : 0
        }))
        .sort((a, b) => b.progress_score - a.progress_score)
        .slice(0, 5);

      // Calculate progress metrics
      const totalLearningHours = Math.round(Math.random() * 500); // Placeholder - would calculate from actual activity
      const averageProgress = performers && performers.length > 0 
        ? Math.round(performers.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / performers.length)
        : 0;
      const coursesCompleted = (performers || []).filter(p => p.status === 'completed').length;

      return {
        recentActivity,
        topPerformers,
        progressMetrics: {
          totalLearningHours,
          averageProgress,
          coursesCompleted
        }
      };
    },
    enabled: !!currentOrg?.organization_id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}