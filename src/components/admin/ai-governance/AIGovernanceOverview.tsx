import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Activity, CheckCircle, XCircle, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useAIGovernanceStats } from '@/hooks/useAIGovernanceStats';

interface AIGovernanceOverviewProps {
  orgId?: string;
}

const AIGovernanceOverview: React.FC<AIGovernanceOverviewProps> = ({ orgId }) => {
  const { stats, recentActivity, isLoading } = useAIGovernanceStats(orgId);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Active Rules', value: stats.activeRules, icon: Shield, color: 'from-purple-500 to-pink-600' },
    { label: "Today's Activity", value: stats.todaysActivity, icon: Activity, color: 'from-green-500 to-emerald-600' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: Clock, color: 'from-orange-500 to-red-600' },
  ];

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground mt-1">Monitor and manage AI usage across your organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.user_name || activity.user_email || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">Used {activity.tool_id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{formatTime(activity.started_at)}</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Compliance Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Overall Compliance</span>
                <span className="text-sm font-bold text-green-600">{stats.complianceRate}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.complianceRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.activeRules}</p>
                <p className="text-xs text-muted-foreground">Active Rules</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.todaysActivity}</p>
                <p className="text-xs text-muted-foreground">Today's Usage</p>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGovernanceOverview;
