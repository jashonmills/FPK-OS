import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Loader2 } from 'lucide-react';
import { useUserPrimaryOrganization } from '@/hooks/useUserOrganization';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface TeacherActivityProps {
  orgId?: string;
}

const TeacherActivity: React.FC<TeacherActivityProps> = ({ orgId: propOrgId }) => {
  const { organization, isLoading: orgLoading } = useUserPrimaryOrganization();
  // Use prop orgId if provided, otherwise fall back to primary organization
  const orgId = propOrgId || organization?.organization_id || '';

  // Fetch activities from activity_log
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['teacher-activity-log', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
      
      // Enrich with user names
      const userIds = [...new Set((data || []).map(a => a.user_id))];
      
      if (userIds.length === 0) return [];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, full_name')
        .in('id', userIds);
      
      const profileMap = new Map(
        (profiles || []).map(p => [p.id, p.display_name || p.full_name || 'Unknown User'])
      );
      
      return (data || []).map(activity => ({
        id: activity.id,
        action: formatActivityEvent(activity.event, activity.metadata),
        student: profileMap.get(activity.user_id) || 'Unknown User',
        time: activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : 'Unknown',
      }));
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 2,
  });

  const isLoading = (!propOrgId && orgLoading) || activitiesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Activity Log</h2>
        <p className="text-muted-foreground mt-1">Recent activities in your organization</p>
      </div>

      {activities.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No activities yet</h3>
          <p className="text-muted-foreground text-sm">
            Activities will appear here as users interact with the platform.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl shadow-sm border border-border p-6"
            >
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.student}</p>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper to format activity events into readable text
function formatActivityEvent(event: string, metadata: any): string {
  const eventMap: Record<string, string> = {
    'lesson_completed': `Completed lesson "${metadata?.lesson_title || metadata?.lessonTitle || 'Unknown'}"`,
    'course_started': `Started course "${metadata?.course_title || metadata?.courseTitle || 'Unknown'}"`,
    'course_completed': `Completed course "${metadata?.course_title || metadata?.courseTitle || 'Unknown'}"`,
    'ai_chat_message': 'Used AI assistant',
    'goal_created': `Created goal "${metadata?.title || 'Unknown'}"`,
    'goal_completed': `Completed goal "${metadata?.title || 'Unknown'}"`,
    'note_created': 'Created a note',
    'login': 'Logged in',
    'signup': 'Joined the organization',
  };
  
  return eventMap[event] || event.replace(/_/g, ' ');
}

export default TeacherActivity;
