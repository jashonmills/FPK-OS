import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, ScrollText, Cpu, CheckSquare, Activity, FileText, Settings, Wrench, Key, BookOpen, FlaskConical, AlertCircle, MessageSquare } from 'lucide-react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import {
  AIGovernanceOverview,
  AIGovernanceUsers,
  AIGovernanceRules,
  AIGovernanceModels,
  AIGovernanceToolMapping,
  AIGovernanceBYOK,
  AIGovernanceKnowledgeBase,
  AIGovernanceApprovals,
  AIGovernanceMonitoring,
  AIGovernanceAuditLog,
  AIGovernanceSettings,
  AIGovernanceTestPanel,
  AIGovernanceGroups,
} from '@/components/admin/ai-governance';

const OrgAIGovernance: React.FC = () => {
  const { currentOrg, getEffectiveRole } = useOrgContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  const orgId = currentOrg?.organization_id;
  const effectiveRole = getEffectiveRole();
  
  // Only allow owners and admins (respects "View As" impersonation)
  if (effectiveRole !== 'owner' && effectiveRole !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Only organization owners and admins can access AI Governance settings.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'groups', label: 'Groups', icon: MessageSquare },
    { id: 'rules', label: 'Rules', icon: ScrollText },
    { id: 'models', label: 'Models', icon: Cpu },
    { id: 'tool-mapping', label: 'Tool Mapping', icon: Wrench },
    { id: 'byok', label: 'BYOK', icon: Key },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'audit', label: 'Audit Log', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'testing', label: 'Testing', icon: FlaskConical },
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
            Manage AI usage policies, monitor activities, and configure governance settings for your organization
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
            <AIGovernanceOverview orgId={orgId} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AIGovernanceUsers orgId={orgId} />
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            <AIGovernanceGroups orgId={orgId} />
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <AIGovernanceRules orgId={orgId} />
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <AIGovernanceModels orgId={orgId} />
          </TabsContent>

          <TabsContent value="tool-mapping" className="mt-6">
            <AIGovernanceToolMapping orgId={orgId} />
          </TabsContent>

          <TabsContent value="byok" className="mt-6">
            <AIGovernanceBYOK orgId={orgId} />
          </TabsContent>

          <TabsContent value="knowledge-base" className="mt-6">
            <AIGovernanceKnowledgeBase orgId={orgId} />
          </TabsContent>

          <TabsContent value="approvals" className="mt-6">
            <AIGovernanceApprovals orgId={orgId} />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <AIGovernanceMonitoring orgId={orgId} />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AIGovernanceAuditLog orgId={orgId} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AIGovernanceSettings orgId={orgId} />
          </TabsContent>

          <TabsContent value="testing" className="mt-6">
            <AIGovernanceTestPanel orgId={orgId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrgAIGovernance;
