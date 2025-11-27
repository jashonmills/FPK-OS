
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Filter, Download } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  action: string;
  threshold_id: string;
  user_id: string;
  changes: Record<string, any>;
  timestamp: string;
  user_email?: string;
}

interface ThresholdAuditLogProps {
  auditLog: AuditLogEntry[];
}

const ThresholdAuditLog: React.FC<ThresholdAuditLogProps> = ({ auditLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'enable':
        return 'bg-purple-100 text-purple-800';
      case 'disable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatChanges = (changes: Record<string, any>) => {
    if (!changes || Object.keys(changes).length === 0) {
      return 'No specific changes recorded';
    }

    return Object.entries(changes)
      .map(([key, value]) => {
        if (typeof value === 'object' && value.from !== undefined && value.to !== undefined) {
          return `${key}: ${value.from} → ${value.to}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(', ');
  };

  const filteredAuditLog = auditLog.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.threshold_id.includes(searchTerm);

    const matchesAction = actionFilter === 'all' || 
      entry.action.toLowerCase() === actionFilter.toLowerCase();

    const matchesDate = dateFilter === 'all' || (() => {
      const entryDate = new Date(entry.timestamp);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return entryDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return entryDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesAction && matchesDate;
  });

  const exportAuditLog = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Threshold ID', 'Changes'].join(','),
      ...filteredAuditLog.map(entry => [
        entry.timestamp,
        entry.action,
        entry.user_email || 'Unknown',
        entry.threshold_id,
        formatChanges(entry.changes).replace(/,/g, ';')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threshold-audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Audit Log</h2>
        <Button onClick={exportAuditLog} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users, actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="enable">Enable</SelectItem>
                  <SelectItem value="disable">Disable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Results</label>
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                {filteredAuditLog.length} entries
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <div className="space-y-4">
        {filteredAuditLog.map((entry) => (
          <Card key={entry.id} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <History className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={getActionColor(entry.action)}>
                        {entry.action}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        by {entry.user_email || 'Unknown User'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  ID: {entry.threshold_id.slice(0, 8)}...
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Changes Made:</h4>
                <p className="text-sm text-gray-700">
                  {formatChanges(entry.changes)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAuditLog.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No audit entries found</h3>
              <p className="text-gray-500">
                {searchTerm || actionFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Audit log entries will appear here as threshold configurations are modified.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ThresholdAuditLog;
