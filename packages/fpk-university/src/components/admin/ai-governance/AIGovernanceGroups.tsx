import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Search, Loader2, ToggleLeft, ToggleRight, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useOrgGroups, type OrgGroup } from '@/hooks/useOrgGroups';
import { toast } from 'sonner';

interface AIGovernanceGroupsProps {
  orgId?: string;
}

const AIGovernanceGroups: React.FC<AIGovernanceGroupsProps> = ({ orgId }) => {
  const { groups, isLoading, toggleMessaging, isTogglingMessaging } = useOrgGroups(orgId);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const messagingEnabledCount = groups.filter(g => g.messaging_enabled).length;
  const totalStudents = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);

  const handleToggleMessaging = (group: OrgGroup) => {
    toggleMessaging({
      groupId: group.id,
      enabled: !group.messaging_enabled
    });
  };

  const handleEnableAll = () => {
    const disabledGroups = groups.filter(g => !g.messaging_enabled);
    if (disabledGroups.length === 0) {
      toast.info('All groups already have messaging enabled');
      return;
    }
    disabledGroups.forEach(group => {
      toggleMessaging({ groupId: group.id, enabled: true });
    });
  };

  const handleDisableAll = () => {
    const enabledGroups = groups.filter(g => g.messaging_enabled);
    if (enabledGroups.length === 0) {
      toast.info('All groups already have messaging disabled');
      return;
    }
    enabledGroups.forEach(group => {
      toggleMessaging({ groupId: group.id, enabled: false });
    });
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
        <h2 className="text-2xl font-bold text-foreground">Student Groups & Messaging</h2>
        <p className="text-muted-foreground mt-1">Manage messaging permissions for student groups</p>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
      >
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Managed Trust Messaging</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              When messaging is enabled for a group, students in that group can message each other directly. 
              Students can always message educators regardless of group settings. Educators can message anyone.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{groups.length}</p>
              <p className="text-xs text-muted-foreground">Total Groups</p>
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
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{messagingEnabledCount}</p>
              <p className="text-xs text-muted-foreground">Messaging Enabled</p>
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bulk Actions and Search */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleEnableAll}
              variant="outline"
              size="sm"
              disabled={isTogglingMessaging}
            >
              <ToggleRight className="h-4 w-4 mr-2 text-green-600" />
              Enable All
            </Button>
            <Button
              onClick={handleDisableAll}
              variant="outline"
              size="sm"
              disabled={isTogglingMessaging}
            >
              <ToggleLeft className="h-4 w-4 mr-2 text-muted-foreground" />
              Disable All
            </Button>
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-3">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-2 rounded-lg ${group.messaging_enabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                  <Users className={`h-5 w-5 ${group.messaging_enabled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{group.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {group.member_count || 0} members
                    </Badge>
                  </div>
                  {group.description && (
                    <p className="text-sm text-muted-foreground truncate">{group.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {group.messaging_enabled ? (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium hidden sm:inline">
                      Messaging On
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Messaging Off
                    </span>
                  )}
                  <Switch
                    checked={group.messaging_enabled}
                    onCheckedChange={() => handleToggleMessaging(group)}
                    disabled={isTogglingMessaging}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {groups.length === 0 ? 'No groups created yet' : 'No groups match your search'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGovernanceGroups;
