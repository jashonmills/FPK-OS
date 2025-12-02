import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ActivityItem {
  id: number;
  user: string;
  role: string;
  task: string;
  category: string;
  status: 'approved' | 'pending' | 'blocked';
  timestamp: string;
  duration: string;
}

const AIGovernanceMonitoring: React.FC = () => {
  const [activities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('aiActivities');
    return saved ? JSON.parse(saved) : [
      { id: 1, user: 'Sarah Johnson', role: 'student', task: 'Essay writing assistance', category: 'Academic', status: 'approved', timestamp: new Date().toISOString(), duration: '5m 23s' },
      { id: 2, user: 'Mike Davis', role: 'student', task: 'Code debugging help', category: 'Technical', status: 'pending', timestamp: new Date(Date.now() - 300000).toISOString(), duration: '2m 15s' },
      { id: 3, user: 'Emily Chen', role: 'teacher', task: 'Lesson plan generation', category: 'Academic', status: 'approved', timestamp: new Date(Date.now() - 900000).toISOString(), duration: '8m 45s' },
      { id: 4, user: 'Alex Turner', role: 'student', task: 'Image generation for project', category: 'Creative', status: 'blocked', timestamp: new Date(Date.now() - 1800000).toISOString(), duration: '1m 30s' },
      { id: 5, user: 'Lisa Wong', role: 'student', task: 'Math problem solving', category: 'Academic', status: 'approved', timestamp: new Date(Date.now() - 3600000).toISOString(), duration: '4m 12s' },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.task.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || activity.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'blocked': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-orange-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'blocked': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Activity Monitoring</h2>
        <p className="text-muted-foreground mt-1">Real-time monitoring of all AI activities across the school</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by user or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>

          <Button
            onClick={() => toast({
              title: "Export Data",
              description: "This feature will be available in a future update."
            })}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {getStatusIcon(activity.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{activity.user}</h4>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs capitalize">
                      {activity.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.task}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                  <p className="text-xs text-muted-foreground/70">{activity.duration}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} capitalize`}>
                  {activity.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No activities found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGovernanceMonitoring;
