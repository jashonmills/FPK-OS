import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ShieldAlert, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAIGovernanceAuditLog } from '@/hooks/useAIGovernanceAuditLog';
import { PlatformAdminOrgSelector } from './PlatformAdminOrgSelector';

interface AIGovernanceAuditLogProps {
  orgId?: string;
}

const AIGovernanceAuditLog: React.FC<AIGovernanceAuditLogProps> = ({ orgId: propOrgId }) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(propOrgId || null);
  const effectiveOrgId = propOrgId || selectedOrgId;
  const { auditLog, isLoading } = useAIGovernanceAuditLog(effectiveOrgId);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLog.filter(log => 
    (log.actor_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string | null) => {
    switch(status) {
      case 'success': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'warning': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'error': 
      case 'danger': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Actor', 'Action', 'Resource', 'Status'].join(','),
      ...filteredLogs.map(log => [
        log.created_at,
        log.actor_email || 'System',
        log.action_type,
        log.resource_type,
        log.status || 'success',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Audit log exported');
  };

  return (
    <div className="space-y-6">
      {!propOrgId && (
        <PlatformAdminOrgSelector
          selectedOrgId={selectedOrgId}
          onOrgChange={setSelectedOrgId}
        />
      )}

      <div>
        <h2 className="text-2xl font-bold text-foreground">System Audit Log</h2>
        <p className="text-muted-foreground mt-1">Comprehensive tracking of all administrative actions and system events</p>
      </div>

      {!effectiveOrgId ? (
        <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select an Organization</h3>
          <p className="text-muted-foreground">Choose an organization above to view its audit log</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border flex flex-col h-[600px]">
          <div className="p-4 border-b border-border flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search logs by actor, action, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="ml-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Actor</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Resource</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log, index) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{log.actor_email || 'System'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(log.status)}`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {log.resource_type}
                      {log.resource_id && <span className="text-xs ml-1">({log.resource_id.slice(0, 8)}...)</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(log.status)}`}>
                        {log.status || 'success'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border bg-muted/30 rounded-b-xl">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {filteredLogs.length} entries</span>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-3 w-3" />
                <span>Logs are immutable and retained for 180 days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGovernanceAuditLog;
