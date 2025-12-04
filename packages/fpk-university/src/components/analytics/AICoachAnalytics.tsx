
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, MessageCircle, Search, TrendingUp } from 'lucide-react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatTopics } from '@/hooks/useChatTopics';
import { useKnowledgeBaseUsage } from '@/hooks/useKnowledgeBaseUsage';
import EmptyState from '@/components/analytics/EmptyState';
import AICoachEngagementCard from '@/components/analytics/AICoachEngagementCard';

const AICoachAnalytics = () => {
  const { sessions, isLoading: sessionsLoading } = useChatSessions();
  const { data: topicsData, loading: topicsLoading } = useChatTopics();
  const { data: knowledgeUsage, loading: knowledgeLoading } = useKnowledgeBaseUsage();

  const loading = sessionsLoading;

  // Calculate total messages from sessions data
  const totalMessages = React.useMemo(() => {
    if (!sessions?.length) return 0;
    // Sum up message counts from sessions if available
    return sessions.reduce((sum, session) => {
      // Assuming each session has at least 2 messages (user + assistant)
      return sum + 2;
    }, 0);
  }, [sessions]);

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

  // Process knowledge base vs chat data
  const knowledgeVsChatData = React.useMemo(() => {
    if (!sessions?.length) return [];
    
    // Create data for last 7 days using real knowledge base usage
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Count chat sessions for this date
      const chatsThisDay = sessions.filter(session => 
        session.created_at.startsWith(dateStr)
      ).length;
      
      // Count knowledge base hits for this date
      const knowledgeHitsThisDay = knowledgeUsage?.filter(usage => 
        new Date(usage.created_at).toISOString().split('T')[0] === dateStr
      ).length || 0;

      return {
        date: date.toLocaleDateString(),
        chats: chatsThisDay,
        knowledgeHits: knowledgeHitsThisDay
      };
    }).reverse();

    return last7Days;
  }, [sessions, knowledgeUsage]);

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
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chatActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
          {!topicsLoading && topicsData.length > 0 ? (
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={10} />
                  <YAxis dataKey="topic" type="category" fontSize={10} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={Brain}
              title="No topics identified yet"
              description="Continue chatting with AI Coach to see topic analysis"
            />
          )}
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
          {!knowledgeLoading && knowledgeVsChatData.length > 0 ? (
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={knowledgeVsChatData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="knowledgeHits" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="chats" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={Search}
              title="No knowledge base activity yet"
              description="Use search and chat features to see comparison data"
            />
          )}
        </CardContent>
      </Card>

      {/* AI Coach Usage Summary */}
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
                {totalMessages}
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
                {Math.round(totalMessages / Math.max(sessions?.length || 1, 1))}
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
