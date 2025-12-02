import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, ScrollText, Cpu, CheckSquare, Activity, FileText, Settings } from 'lucide-react';
import {
  AIGovernanceOverview,
  AIGovernanceUsers,
  AIGovernanceRules,
  AIGovernanceModels,
  AIGovernanceApprovals,
  AIGovernanceMonitoring,
  AIGovernanceAuditLog,
  AIGovernanceSettings,
} from '@/components/admin/ai-governance';

const AIGovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'rules', label: 'Rules', icon: ScrollText },
    { id: 'models', label: 'Models', icon: Cpu },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'audit', label: 'Audit Log', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Governance</h1>
          </div>
          <p className="text-muted-foreground">
            Manage AI usage policies, monitor activities, and configure governance settings across your organization
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border p-1 h-auto flex-wrap gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AIGovernanceOverview />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AIGovernanceUsers />
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <AIGovernanceRules />
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <AIGovernanceModels />
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <AIGovernanceApprovals />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <AIGovernanceMonitoring />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AIGovernanceAuditLog />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AIGovernanceSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIGovernancePage;
