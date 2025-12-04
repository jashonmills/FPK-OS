
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Zap, BookOpen, Trophy } from 'lucide-react';

const RecentActivityFeed = () => {
  const { user } = useAuth();

  const { data: recentActivity = [], isLoading } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch recent notes
      const { data: notes } = await supabase
        .from('notes')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent flashcards
      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('id, front_content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent study sessions
      const { data: studySessions } = await supabase
        .from('study_sessions')
        .select('id, session_type, created_at, total_cards, correct_answers')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('id, achievement_name, unlocked_at, xp_reward')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })
        .limit(3);

      // Combine and sort all activities
      const activities = [
        ...(notes?.map(note => ({
          id: `note-${note.id}`,
          type: 'note',
          title: note.title,
          timestamp: note.created_at,
          icon: FileText,
          color: 'text-blue-600'
        })) || []),
        ...(flashcards?.map(card => ({
          id: `flashcard-${card.id}`,
          type: 'flashcard',
          title: card.front_content.substring(0, 50) + (card.front_content.length > 50 ? '...' : ''),
          timestamp: card.created_at,
          icon: Zap,
          color: 'text-orange-600'
        })) || []),
        ...(studySessions?.map(session => ({
          id: `session-${session.id}`,
          type: 'study',
          title: `${session.session_type} - ${session.correct_answers}/${session.total_cards} correct`,
          timestamp: session.created_at,
          icon: BookOpen,
          color: 'text-green-600'
        })) || []),
        ...(achievements?.map(achievement => ({
          id: `achievement-${achievement.id}`,
          type: 'achievement',
          title: `${achievement.achievement_name} (+${achievement.xp_reward} XP)`,
          timestamp: achievement.unlocked_at,
          icon: Trophy,
          color: 'text-yellow-600'
        })) || [])
      ];

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8);
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentActivity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No recent activity</h3>
            <p className="text-sm text-muted-foreground">
              Start learning to see your activity here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
