import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Shield, Database, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAIGovernanceSettings, NotificationSettings, SecuritySettings, DataRetentionSettings } from '@/hooks/useAIGovernanceSettings';

interface LocalSettings {
  notifications: NotificationSettings;
  security: SecuritySettings;
  dataRetention: DataRetentionSettings;
}

const AIGovernanceSettings: React.FC = () => {
  // Note: In production, you'd get orgId from context
  const { settings, isLoading, updateSettings } = useAIGovernanceSettings();
  
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
    notifications: settings.notifications,
    security: settings.security,
    dataRetention: settings.data_retention,
  });

  useEffect(() => {
    setLocalSettings({
      notifications: settings.notifications,
      security: settings.security,
      dataRetention: settings.data_retention,
    });
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({
      notifications: localSettings.notifications,
      security: localSettings.security,
      data_retention: localSettings.dataRetention,
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
        <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
        <p className="text-muted-foreground mt-1">Configure AI governance platform settings</p>
      </div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-sm border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailAlerts" className="cursor-pointer">Email alerts for pending approvals</Label>
              <Checkbox
                id="emailAlerts"
                checked={localSettings.notifications.emailAlerts}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  notifications: { ...localSettings.notifications, emailAlerts: checked as boolean }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyReports" className="cursor-pointer">Daily activity reports</Label>
              <Checkbox
                id="dailyReports"
                checked={localSettings.notifications.dailyReports}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  notifications: { ...localSettings.notifications, dailyReports: checked as boolean }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="criticalOnly" className="cursor-pointer">Critical alerts only</Label>
              <Checkbox
                id="criticalOnly"
                checked={localSettings.notifications.criticalOnly}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  notifications: { ...localSettings.notifications, criticalOnly: checked as boolean }
                })}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl shadow-sm border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="requireApproval" className="cursor-pointer">Require admin approval for AI tasks</Label>
              <Checkbox
                id="requireApproval"
                checked={localSettings.security.requireApproval}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  security: { ...localSettings.security, requireApproval: checked as boolean }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoBlock" className="cursor-pointer">Auto-block suspicious activities</Label>
              <Checkbox
                id="autoBlock"
                checked={localSettings.security.autoBlockSuspicious}
                onCheckedChange={(checked) => setLocalSettings({
                  ...localSettings,
                  security: { ...localSettings.security, autoBlockSuspicious: checked as boolean }
                })}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
              <input
                id="sessionTimeout"
                type="number"
                value={localSettings.security.sessionTimeout}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  security: { ...localSettings.security, sessionTimeout: parseInt(e.target.value) || 30 }
                })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-2"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl shadow-sm border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Data Retention</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="activityLogs">Activity logs retention (days)</Label>
              <input
                id="activityLogs"
                type="number"
                value={localSettings.dataRetention.activityLogs}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  dataRetention: { ...localSettings.dataRetention, activityLogs: parseInt(e.target.value) || 90 }
                })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-2"
              />
            </div>
            <div>
              <Label htmlFor="approvalHistory">Approval history retention (days)</Label>
              <input
                id="approvalHistory"
                type="number"
                value={localSettings.dataRetention.approvalHistory}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  dataRetention: { ...localSettings.dataRetention, approvalHistory: parseInt(e.target.value) || 180 }
                })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-2"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AIGovernanceSettings;
