import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TestTube, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PodcastGallery } from '@/components/phoenix/PodcastGallery';

export default function PhoenixAnalytics() {
  const navigate = useNavigate();

  // Fetch Phoenix Analytics KPIs
  const { data: phoenixStats, isLoading } = useQuery({
    queryKey: ['phoenixAnalyticsKPIs'],
    queryFn: async () => {
      const { data: conversations, error } = await supabase
        .from('phoenix_conversations')
        .select('id, created_at, metadata');
      
      if (error) throw error;
      
      const totalSessions = conversations?.length || 0;
      
      // Get message counts
      const { data: messages } = await supabase
        .from('phoenix_messages')
        .select('conversation_id, persona');
      
      const totalInteractions = messages?.length || 0;
      
      const avgTurnsPerSession = totalSessions > 0 
        ? (totalInteractions / totalSessions).toFixed(1) 
        : '0.0';
      
      return {
        totalSessions,
        totalInteractions,
        avgTurnsPerSession,
      };
    },
  });

  const stats = [
    {
      title: 'Total Sessions',
      value: phoenixStats?.totalSessions || 0,
      icon: Users,
      description: 'Phoenix Lab sessions',
      color: 'text-blue-600',
    },
    {
      title: 'Total Interactions',
      value: phoenixStats?.totalInteractions || 0,
      icon: MessageSquare,
      description: 'User-AI exchanges',
      color: 'text-green-600',
    },
    {
      title: 'Avg Turns/Session',
      value: phoenixStats?.avgTurnsPerSession || '0.0',
      icon: TrendingUp,
      description: 'Conversation depth',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <TestTube className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold">Project Phoenix Analytics</h1>
              <p className="text-muted-foreground">AI Coach testing and performance metrics</p>
            </div>
            <Badge variant="secondary" className="ml-2">Phase 3</Badge>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-muted rounded"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Podcast Gallery Section */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Moments Podcast</CardTitle>
          <CardDescription>
            Automatically generated podcast episodes celebrating breakthrough moments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PodcastGallery />
        </CardContent>
      </Card>

      {/* Placeholder for Future Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Additional analytics visualizations and insights will be added here
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12 text-muted-foreground">
          <TestTube className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Session breakdown, conversation quality metrics, and more</p>
        </CardContent>
      </Card>
    </div>
  );
}
