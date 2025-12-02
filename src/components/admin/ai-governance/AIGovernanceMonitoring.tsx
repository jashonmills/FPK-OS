import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Activity, Clock, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAIGovernanceMonitoring } from '@/hooks/useAIGovernanceMonitoring';

const AIGovernanceMonitoring: React.FC = () => {
  const { sessions, isLoading, refetch } = useAIGovernanceMonitoring();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter(session => {
    const userName = session.user_name || session.user_email || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           session.tool_id.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  const handleExport = () => {
    const csv = [
      ['User', 'Tool', 'Started', 'Duration', 'Messages'].join(','),
      ...filteredSessions.map(s => [
        s.user_name || s.user_email || 'Unknown',
        s.tool_id,
        new Date(s.started_at).toISOString(),
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

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
          
          <Button
            onClick={() => refetch()}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button
            onClick={handleExport}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {session.ended_at ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-orange-500 animate-pulse" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">
                      {session.user_name || session.user_email || 'Unknown User'}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.tool_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGovernanceMonitoring;
