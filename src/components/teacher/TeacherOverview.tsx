import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, MessageSquare, TrendingUp, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrgStudents } from '@/hooks/useOrgStudents';
import { useUserPrimaryOrganization } from '@/hooks/useUserOrganization';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import type { TeacherTabId } from './TeacherPanel';

interface TeacherOverviewProps {
  setActiveTab: (tab: TeacherTabId) => void;
}

const TeacherOverview: React.FC<TeacherOverviewProps> = ({ setActiveTab }) => {
  const { organization, isLoading: orgLoading } = useUserPrimaryOrganization();
  const orgId = organization?.organization_id || '';
  
  const { students, isLoading: studentsLoading } = useOrgStudents(orgId);
  
  // Get linked user IDs for students with accounts
  const linkedUserIds = students
    .filter(s => s.linked_user_id)
    .map(s => s.linked_user_id as string);

  // Fetch AI requests count (messages sent by students in last 30 days)
  const { data: aiRequestsCount = 0, isLoading: aiLoading } = useQuery({
    queryKey: ['teacher-ai-requests', orgId, linkedUserIds],
    queryFn: async () => {
      if (linkedUserIds.length === 0) return 0;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Query ai_coach_analytics for messages_sent aggregate
      const { data: analyticsData, error } = await supabase
        .from('ai_coach_analytics')
        .select('messages_sent')
        .in('user_id', linkedUserIds)
        .gte('session_date', thirtyDaysAgo.toISOString().split('T')[0]);
      
      if (error) {
        console.error('Error fetching AI requests:', error);
        return 0;
      }
      
      return (analyticsData || []).reduce((sum, row) => sum + (row.messages_sent || 0), 0);
    },
    enabled: linkedUserIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch lessons completed by students (as a proxy for "lessons created" engagement)
  const { data: lessonsData = 0, isLoading: lessonsLoading } = useQuery({
    queryKey: ['teacher-lessons-completed', orgId, linkedUserIds],
    queryFn: async () => {
      if (linkedUserIds.length === 0) return 0;
      
      const { count, error } = await supabase
        .from('interactive_lesson_analytics')
        .select('*', { count: 'exact', head: true })
        .in('user_id', linkedUserIds);
      
      if (error) {
        console.error('Error fetching lessons:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: linkedUserIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch engagement rate (based on students with activity in last 7 days)
  const { data: engagementRate = 0, isLoading: engagementLoading } = useQuery({
    queryKey: ['teacher-engagement-rate', orgId, linkedUserIds],
    queryFn: async () => {
      if (linkedUserIds.length === 0) return 0;
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Count students with recent activity
      const { data: activeStudents, error } = await supabase
        .from('interactive_lesson_analytics')
        .select('user_id')
        .in('user_id', linkedUserIds)
        .gte('created_at', sevenDaysAgo.toISOString());
      
      if (error) {
        console.error('Error fetching engagement:', error);
        return 0;
      }
      
      const uniqueActiveStudents = new Set((activeStudents || []).map(s => s.user_id)).size;
      const rate = linkedUserIds.length > 0 
        ? Math.round((uniqueActiveStudents / linkedUserIds.length) * 100) 
        : 0;
      
      return rate;
    },
    enabled: linkedUserIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recent student activities from activity_log
  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['teacher-recent-activities', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }
      
      // Enrich with student names
      const userIds = [...new Set((data || []).map(a => a.user_id))];
      
      if (userIds.length === 0) return [];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, full_name')
        .in('id', userIds);
      
      const profileMap = new Map(
        (profiles || []).map(p => [p.id, p.display_name || p.full_name || 'Unknown Student'])
      );
      
      return (data || []).map(activity => ({
        id: activity.id,
        student: profileMap.get(activity.user_id) || 'Unknown Student',
        activity: formatActivityEvent(activity.event, activity.metadata),
        time: activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : 'Unknown',
      }));
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 2,
  });

  const isLoading = orgLoading || studentsLoading;

  const stats = [
    { label: 'My Students', value: students.length, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'AI Requests', value: aiLoading ? '...' : aiRequestsCount, icon: MessageSquare, color: 'from-purple-500 to-pink-600' },
    { label: 'Lessons Completed', value: lessonsLoading ? '...' : lessonsData, icon: BookOpen, color: 'from-green-500 to-emerald-600' },
    { label: 'Engagement Rate', value: engagementLoading ? '...' : `${engagementRate}%`, icon: TrendingUp, color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Teacher Dashboard</h2>
          <p className="text-muted-foreground mt-1">Monitor your students' AI usage and manage your classroom</p>
        </div>
        <Button 
          onClick={() => setActiveTab('tools')} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Launch AI Tools
        </Button>
      </div>

      {/* Quick Actions Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Create Your Next Lesson in Seconds</h3>
          <p className="text-primary-foreground/80 mb-6 max-w-xl">Use our new AI-powered tools to generate lesson plans, quizzes, and rubrics instantly. Focus on teaching, let AI handle the prep.</p>
          <Button 
            variant="secondary" 
            onClick={() => setActiveTab('tools')}
            className="bg-white text-primary hover:bg-white/90 border-none"
          >
            Open Creator Studio <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl shadow-sm border border-border p-6"
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} w-fit mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Student Activities</h3>
        {activitiesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent student activities</p>
            <p className="text-sm mt-1">Activities will appear here as students interact with the platform</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium text-foreground">{item.student}</p>
                  <p className="text-sm text-muted-foreground">{item.activity}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
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

export default TeacherOverview;
