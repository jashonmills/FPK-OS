
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Bell, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import EmptyState from '@/components/analytics/EmptyState';

const NotificationsAnalytics = () => {
  const { notifications, loading } = useNotifications();

  // Process notification data
  const notificationStats = React.useMemo(() => {
    if (!notifications?.length) return { openRate: 0, total: 0, opened: 0 };
    
    const opened = notifications.filter(n => n.read_status).length;
    const total = notifications.length;
    
    return {
      openRate: Math.round((opened / total) * 100),
      total,
      opened,
      unopened: total - opened
    };
  }, [notifications]);

  // Process notification types data
  const notificationTypesData = React.useMemo(() => {
    if (!notifications?.length) return [];
    
    const typeStats = notifications.reduce((acc, notification) => {
      const type = notification.type || 'general';
      if (!acc[type]) {
        acc[type] = { sent: 0, opened: 0 };
      }
      acc[type].sent += 1;
      if (notification.read_status) {
        acc[type].opened += 1;
      }
      return acc;
    }, {} as Record<string, { sent: number; opened: number }>);

    return Object.entries(typeStats).map(([type, stats]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      sent: stats.sent,
      opened: stats.opened,
      openRate: Math.round((stats.opened / stats.sent) * 100)
    }));
  }, [notifications]);

  // Mock response time data (would need actual tracking)
  const responseTimeData = [
    { timeRange: '< 1 hour', count: 15, percentage: 60 },
    { timeRange: '1-6 hours', count: 7, percentage: 28 },
    { timeRange: '6-24 hours', count: 2, percentage: 8 },
    { timeRange: '> 24 hours', count: 1, percentage: 4 }
  ];

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
    sent: {
      label: 'Sent',
      color: '#8B5CF6',
    },
    opened: {
      label: 'Opened',
      color: '#10B981',
    },
    count: {
      label: 'Count',
      color: '#F59E0B',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Notification Open Rate */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Notification Open-Rate
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            How often you interact with notifications
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {notificationStats.total > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {notificationStats.openRate}%
                </div>
                <p className="text-sm text-gray-500">Open Rate</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {notificationStats.opened}
                  </div>
                  <p className="text-xs text-gray-500">Opened</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-600">
                    {notificationStats.unopened}
                  </div>
                  <p className="text-xs text-gray-500">Unopened</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState 
              icon={Bell}
              title="No notifications yet"
              description="Notifications will appear here as you use the app"
            />
          )}
        </CardContent>
      </Card>

      {/* Notification Types Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            Notification Types Performance
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Engagement by notification type
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {notificationTypesData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={notificationTypesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sent" fill="var(--color-sent)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="opened" fill="var(--color-opened)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={MessageSquare}
              title="No notification data available"
              description="Data will appear as you receive and interact with notifications"
            />
          )}
        </CardContent>
      </Card>

      {/* Reminder Response Time */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0" />
            Reminder Response Time
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            How quickly you respond to reminders
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeRange" fontSize={10} />
                <YAxis fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Push Notification Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            Notification Preferences
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your current notification settings
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Study Reminders</span>
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Goal Notifications</span>
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Weekly Summaries</span>
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">AI Coaching Tips</span>
              <span className="text-sm font-medium text-gray-600">Disabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">New Course Alerts</span>
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsAnalytics;
