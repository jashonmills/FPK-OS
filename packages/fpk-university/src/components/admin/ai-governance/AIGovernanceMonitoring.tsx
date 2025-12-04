import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Activity, Clock, CheckCircle, Loader2, RefreshCw, Users, MessageSquare, BarChart3, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAIGovernanceMonitoring } from '@/hooks/useAIGovernanceMonitoring';

interface AIGovernanceMonitoringProps {
  orgId?: string;
}

const AIGovernanceMonitoring: React.FC<AIGovernanceMonitoringProps> = ({ orgId }) => {
  const { sessions, isLoading, refetch } = useAIGovernanceMonitoring(orgId);
  const [searchTerm, setSearchTerm] = useState('');
  const [toolFilter, setToolFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('7d');

  // Get unique tools for filter dropdown
  const uniqueTools = useMemo(() => {
    const tools = new Set(sessions.map(s => s.tool_id));
    return Array.from(tools).sort();
  }, [sessions]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateFilter) {
      case '24h': filterDate.setHours(now.getHours() - 24); break;
      case '7d': filterDate.setDate(now.getDate() - 7); break;
      case '30d': filterDate.setDate(now.getDate() - 30); break;
      case '90d': filterDate.setDate(now.getDate() - 90); break;
      default: filterDate.setDate(now.getDate() - 7);
    }

    const filteredByDate = sessions.filter(s => new Date(s.started_at) >= filterDate);
    const activeSessions = filteredByDate.filter(s => !s.ended_at);
    const completedSessions = filteredByDate.filter(s => s.ended_at);
    const uniqueUsers = new Set(filteredByDate.map(s => s.user_id));
    const totalMessages = filteredByDate.reduce((sum, s) => sum + (s.message_count || 0), 0);
    
    // Calculate average duration for completed sessions
    let avgDuration = 0;
    if (completedSessions.length > 0) {
      const totalDuration = completedSessions.reduce((sum, s) => {
        const start = new Date(s.started_at).getTime();
        const end = new Date(s.ended_at!).getTime();
        return sum + (end - start);
      }, 0);
      avgDuration = totalDuration / completedSessions.length / 1000; // in seconds
    }

    // Tool usage breakdown
    const toolUsage: Record<string, number> = {};
    filteredByDate.forEach(s => {
      toolUsage[s.tool_id] = (toolUsage[s.tool_id] || 0) + 1;
    });

    return {
      totalSessions: filteredByDate.length,
      activeSessions: activeSessions.length,
      uniqueUsers: uniqueUsers.size,
      totalMessages,
      avgDuration,
      toolUsage,
    };
  }, [sessions, dateFilter]);

  // Apply all filters
  const filteredSessions = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateFilter) {
      case '24h': filterDate.setHours(now.getHours() - 24); break;
      case '7d': filterDate.setDate(now.getDate() - 7); break;
      case '30d': filterDate.setDate(now.getDate() - 30); break;
      case '90d': filterDate.setDate(now.getDate() - 90); break;
      default: filterDate.setDate(now.getDate() - 7);
    }

    return sessions.filter(session => {
      // Date filter
      if (new Date(session.started_at) < filterDate) return false;
      
      // Search filter
      const userName = session.user_name || session.user_email || '';
      const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.tool_id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      
      // Tool filter
      if (toolFilter !== 'all' && session.tool_id !== toolFilter) return false;
      
      // Status filter
      if (statusFilter === 'active' && session.ended_at) return false;
      if (statusFilter === 'completed' && !session.ended_at) return false;
      
      return true;
    });
  }, [sessions, searchTerm, toolFilter, statusFilter, dateFilter]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const calculateDuration = (startedAt: string, endedAt: string | null) => {
    if (!endedAt) return 'Active';
    const start = new Date(startedAt).getTime();
    const end = new Date(endedAt).getTime();
    const diffSeconds = Math.floor((end - start) / 1000);
    if (diffSeconds < 60) return `${diffSeconds}s`;
    return `${Math.floor(diffSeconds / 60)}m ${diffSeconds % 60}s`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const handleExport = () => {
    const csv = [
      ['User', 'Email', 'Tool', 'Started', 'Ended', 'Duration', 'Messages'].join(','),
      ...filteredSessions.map(s => [
        s.user_name || 'Unknown',
        s.user_email || '',
        s.tool_id,
        new Date(s.started_at).toISOString(),
        s.ended_at ? new Date(s.ended_at).toISOString() : 'Active',
        calculateDuration(s.started_at, s.ended_at),
        s.message_count || 0,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-monitoring-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Export downloaded');
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
        <h2 className="text-2xl font-bold text-foreground">Activity Monitoring</h2>
        <p className="text-muted-foreground mt-1">Real-time monitoring of all AI activities</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics.uniqueUsers}</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{metrics.totalMessages}</p>
              <p className="text-xs text-muted-foreground">Total Messages</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatDuration(metrics.avgDuration)}</p>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tool Usage Breakdown */}
      {Object.keys(metrics.toolUsage).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Tool Usage</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metrics.toolUsage)
              .sort((a, b) => b[1] - a[1])
              .map(([tool, count]) => (
                <div 
                  key={tool}
                  className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
                >
                  <span className="text-sm text-foreground">{tool}</span>
                  <span className="text-xs font-medium text-primary">{count}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Filters and Actions */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by user or tool..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[130px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={toolFilter} onValueChange={setToolFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Tools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                {uniqueTools.map(tool => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => refetch()} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Active Sessions Indicator */}
        {metrics.activeSessions > 0 && (
          <div className="mb-4 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700 dark:text-green-300">
              {metrics.activeSessions} active session{metrics.activeSessions > 1 ? 's' : ''} right now
            </span>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {session.ended_at ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-orange-500 animate-pulse shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">
                      {session.user_name || session.user_email || 'Unknown User'}
                    </h4>
                    {!session.ended_at && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.tool_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">{formatTimestamp(session.started_at)}</p>
                  <p className="text-xs text-muted-foreground/70">
                    {calculateDuration(session.started_at, session.ended_at)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {session.message_count || 0} msgs
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No activities found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGovernanceMonitoring;
