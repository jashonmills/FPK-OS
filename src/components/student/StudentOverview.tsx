import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useStudentAIAnalytics } from '@/hooks/useStudentAIAnalytics';
import { useSearchParams } from 'react-router-dom';

const StudentOverview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('org') || undefined;
  const isOrgContext = !!orgId;
  const { stats, recentActivities, isLoading } = useStudentAIAnalytics(orgId);

  // For personal users, show different stats (no governance/approval stats)
  const statCards = isOrgContext
    ? [
        { label: 'AI Tasks Used', value: stats.totalAITasks, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
        { label: 'Approved', value: stats.approvedCount, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
        { label: 'Pending', value: stats.pendingCount, icon: Clock, color: 'from-orange-500 to-red-600' },
        { label: 'Learning Progress', value: `${stats.learningProgress}%`, icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
      ]
    : [
        { label: 'AI Sessions', value: stats.totalAITasks, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
        { label: 'Learning Progress', value: `${stats.learningProgress}%`, icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
      ];

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
        <h2 className="text-2xl font-bold text-foreground">Student Dashboard</h2>
        <p className="text-muted-foreground mt-1">Track your AI-assisted learning journey</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isOrgContext ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6`}>
        {statCards.map((stat, index) => {
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
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent AI Activities</h3>
        {recentActivities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No recent activities yet. Start using AI tools to see your activity here!
          </p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{item.task}</p>
                  <p className="text-sm text-muted-foreground">{item.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    item.status === 'completed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : item.status === 'approved'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOverview;
