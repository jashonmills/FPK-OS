
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Bot, MessageCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { useAICoachAnalytics } from '@/hooks/useAICoachAnalytics';

interface AICoachEngagementCardProps {
  userId?: string;
}

const AICoachEngagementCard = ({ userId }: AICoachEngagementCardProps) => {
  const { metrics, isLoading, error } = useAICoachAnalytics(userId);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            AI Coach Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !metrics) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            AI Coach Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-center py-6 sm:py-8">
            <Bot className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
            <p className="font-medium text-sm sm:text-base">No AI Coach data yet</p>
            <p className="text-xs sm:text-sm text-gray-500">Start a conversation with your AI Coach to see engagement metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare context distribution data for pie chart
  const contextData = Object.entries(metrics.contextTagDistribution).map(([context, count], index) => ({
    name: context,
    value: count,
    color: ['#8B5CF6', '#F59E0B', '#3B82F6', '#EF4444', '#10B981'][index % 5]
  }));

  const chartConfig = {
    sessions: {
      label: 'Sessions',
      color: '#8B5CF6',
    },
    messages: {
      label: 'Messages',
      color: '#F59E0B',
    },
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
          AI Coach Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              <span className="text-xs sm:text-sm font-medium">Sessions</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-purple-600">{metrics.totalSessions}</div>
            {metrics.weeklySessionGrowth !== 0 && (
              <div className={`text-xs flex items-center justify-center gap-1 ${
                metrics.weeklySessionGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                {metrics.weeklySessionGrowth > 0 ? '+' : ''}{metrics.weeklySessionGrowth}%
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
              <span className="text-xs sm:text-sm font-medium">Messages</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-amber-600">{metrics.totalMessages}</div>
            <div className="text-xs text-gray-500">
              ~{metrics.averageMessagesPerSession} per session
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium">Avg Duration</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-blue-600">{metrics.averageSessionDuration}m</div>
            <div className="text-xs text-gray-500">per session</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-xs sm:text-sm font-medium">This Week</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-green-600">{metrics.sessionsThisWeek}</div>
            <div className="text-xs text-gray-500">sessions</div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div>
          <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Weekly Activity Trend</h4>
          {metrics.weeklyActivity.some(week => week.sessions > 0 || week.messages > 0) ? (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[300px] w-full">
                <ChartContainer config={chartConfig} className="h-[180px] sm:h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={metrics.weeklyActivity} 
                      margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        fontSize={10}
                        tick={{ fontSize: 10 }}
                        interval={0}
                      />
                      <YAxis 
                        fontSize={10}
                        tick={{ fontSize: 10 }}
                        width={30}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="sessions" 
                        fill="var(--color-sessions)" 
                        radius={[2, 2, 0, 0]}
                        maxBarSize={40}
                      />
                      <Bar 
                        dataKey="messages" 
                        fill="var(--color-messages)" 
                        radius={[2, 2, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          ) : (
            <div className="h-[180px] sm:h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <Bot className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                <p className="font-medium text-sm sm:text-base">No weekly activity yet</p>
                <p className="text-xs sm:text-sm">Start using AI Coach to see activity trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Context Distribution */}
        {contextData.length > 0 && (
          <div>
            <h4 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Conversation Topics</h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/2">
                <ChartContainer config={{}} className="h-[120px] sm:h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contextData}
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        dataKey="value"
                        label={false}
                      >
                        {contextData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="w-full sm:w-1/2 space-y-2">
                {contextData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Summary Insight */}
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
          <p className="text-xs sm:text-sm text-purple-800">
            {metrics.totalSessions === 0 ? (
              "Ready to start your AI coaching journey! Your first conversation will unlock personalized learning insights."
            ) : metrics.sessionsThisWeek > 0 ? (
              `Great engagement this week! You've had ${metrics.sessionsThisWeek} AI Coach session${metrics.sessionsThisWeek > 1 ? 's' : ''} with an average of ${metrics.averageMessagesPerSession} messages per conversation.`
            ) : (
              `You've completed ${metrics.totalSessions} AI Coach session${metrics.totalSessions > 1 ? 's' : ''}. Consider starting a new conversation to continue your learning journey!`
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoachEngagementCard;
