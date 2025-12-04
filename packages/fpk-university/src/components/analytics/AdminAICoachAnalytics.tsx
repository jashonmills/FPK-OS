import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Users, Clock, TrendingUp } from 'lucide-react';

interface ChatContext {
  context: string;
  count: number;
}

const AdminAICoachAnalytics = () => {
  const { data: aiStats, isLoading } = useQuery({
    queryKey: ['admin-ai-coach-analytics'],
    queryFn: async () => {
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*');

      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*');

      if (sessionsError || messagesError) throw new Error('Failed to load AI coach data');

      const totalSessions = sessions?.length || 0;
      const totalMessages = messages?.length || 0;
      const uniqueUsers = new Set(sessions?.map(s => s.user_id) || []).size;
      const averageMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

      // Context analysis
      const contextStats = sessions?.reduce((acc: Record<string, number>, session) => {
        const context = session.context_tag || 'Other';
        acc[context] = (acc[context] || 0) + 1;
        return acc;
      }, {}) || {};

      const topContexts = Object.entries(contextStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([context, count]) => ({ context, count }));

      return {
        totalSessions,
        totalMessages,
        uniqueUsers,
        averageMessagesPerSession: Math.round(averageMessagesPerSession),
        topContexts
      };
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Coach Platform Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{aiStats?.totalSessions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{aiStats?.totalMessages || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{aiStats?.uniqueUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Messages/Session</p>
                <p className="text-2xl font-bold">{aiStats?.averageMessagesPerSession || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Chat Contexts */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Chat Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiStats?.topContexts?.map((item: ChatContext, index: number) => (
              <div key={item.context} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{item.context}</p>
                    <p className="text-sm text-muted-foreground">Chat context</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.count}</p>
                  <p className="text-sm text-muted-foreground">sessions</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-8">
                No AI coach data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAICoachAnalytics;