
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Brain, MessageCircle, Search, TrendingUp } from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import EmptyState from '@/components/analytics/EmptyState';
import AICoachEngagementCard from '@/components/analytics/AICoachEngagementCard';

const AICoachAnalytics = () => {
  const { sessions, isLoading: sessionsLoading } = useChatSessions();
  const { messages, isLoading: messagesLoading } = useChatMessages();

  const loading = sessionsLoading || messagesLoading;

  // Process chat activity data
  const chatActivityData = React.useMemo(() => {
    if (!sessions?.length) return [];
    
    const dailyActivity = sessions.reduce((acc, session) => {
      const day = new Date(session.created_at).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyActivity)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14) // Last 14 days
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString(),
        sessions: count
      }));
  }, [sessions]);

  // Mock topic analysis data (would need NLP processing)
  const topTopicsData = [
    { topic: 'Learning Strategies', count: 25 },
    { topic: 'Study Techniques', count: 18 },
    { topic: 'Time Management', count: 15 },
    { topic: 'Memory Improvement', count: 12 },
    { topic: 'Focus & Concentration', count: 8 }
  ];

  // Process knowledge base vs chat data
  const knowledgeVsChatData = React.useMemo(() => {
    if (!messages?.length) return [];
    
    // Mock data - would need actual tracking of knowledge base hits
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString(),
        chats: Math.floor(Math.random() * 10) + 1,
        knowledgeHits: Math.floor(Math.random() * 15) + 5
      };
    }).reverse();

    return last7Days;
  }, [messages]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const chartConfig = {
    sessions: {
      label: 'Chat Sessions',
      color: '#8B5CF6',
    },
    count: {
      label: 'Topic Count',
      color: '#F59E0B',
    },
    chats: {
      label: 'Chat Messages',
      color: '#3B82F6',
    },
    knowledgeHits: {
      label: 'Knowledge Base Hits',
      color: '#10B981',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* AI Coach Engagement Card - Existing Component */}
      <div className="lg:col-span-2">
        <AICoachEngagementCard />
      </div>

      {/* Chat Activity Over Time */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Daily Chat Activity
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your AI Coach interaction patterns
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {chatActivityData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chatActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={MessageCircle}
              title="Start chatting with AI Coach"
              description="Begin conversations with your AI Coach to see activity patterns"
            />
          )}
        </CardContent>
      </Card>

      {/* Top AI Coach Topics */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            Top AI Coach Topics
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Most discussed learning topics
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTopicsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={10} />
                <YAxis dataKey="topic" type="category" fontSize={10} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Knowledge Base Hits vs Chats */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            Knowledge Base vs Chat Usage
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Comparison of knowledge retrieval methods
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={knowledgeVsChatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="knowledgeHits" fill="var(--color-knowledgeHits)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="chats" fill="var(--color-chats)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* AI Coach Insights Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
            AI Coach Usage Summary
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your AI coaching engagement metrics
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {sessions?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Total Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {messages?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Messages Sent</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {sessions?.filter(s => s.context_tag === 'Study Coach').length || 0}
              </div>
              <p className="text-xs text-gray-500">Study Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {Math.round((messages?.length || 0) / Math.max(sessions?.length || 1, 1))}
              </div>
              <p className="text-xs text-gray-500">Avg Msgs/Session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoachAnalytics;
