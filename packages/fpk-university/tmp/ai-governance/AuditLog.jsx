
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Download, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AuditLog = () => {
  const [logs] = useState([
    { id: 1, timestamp: '2025-12-01 10:42:15', actor: 'Sarah Admin', role: 'Admin', action: 'Updated AI Rule', target: 'Essay Writing Helper', details: 'Changed allowed status to true', ip: '192.168.1.45', status: 'success' },
    { id: 2, timestamp: '2025-12-01 10:30:00', actor: 'System', role: 'System', action: 'Auto-Blocked', target: 'User: Alex Turner', details: 'Detected prohibited keyword usage', ip: '10.0.0.12', status: 'warning' },
    { id: 3, timestamp: '2025-12-01 09:15:22', actor: 'Mike Teacher', role: 'Teacher', action: 'Approved Request', target: 'Student: Emily Chen', details: 'Approved access to Code Helper', ip: '192.168.1.102', status: 'success' },
    { id: 4, timestamp: '2025-12-01 08:55:10', actor: 'Sarah Admin', role: 'Admin', action: 'Model Config Change', target: 'GPT-4 Turbo', details: 'Updated temperature to 0.7', ip: '192.168.1.45', status: 'success' },
    { id: 5, timestamp: '2025-11-30 16:20:05', actor: 'System', role: 'System', action: 'Login Failed', target: 'Admin Panel', details: 'Multiple failed attempts', ip: '45.22.11.89', status: 'danger' },
    { id: 6, timestamp: '2025-11-30 14:10:33', actor: 'Sarah Admin', role: 'Admin', action: 'User Role Update', target: 'Jennifer Smith', details: 'Promoted to Moderator', ip: '192.168.1.45', status: 'success' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch(status) {
      case 'success': return 'bg-green-50 text-green-700 border-green-200';
      case 'warning': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'danger': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Audit Log</h2>
        <p className="text-gray-600 mt-1">Comprehensive tracking of all administrative actions and system events</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-200 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs by actor, action, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Export Started", description: "Audit log export will be emailed to you." })}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Actor</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">Details</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log, index) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{log.actor}</div>
                    <div className="text-xs text-gray-500">{log.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(log.status)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {log.target}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                    {log.ip}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Showing {filteredLogs.length} entries</span>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" />
              <span>Logs are immutable and retained for 180 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
