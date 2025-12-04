import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2, Image, Code, FileText, Search, FileStack, Calculator, Pencil, BarChart3, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIGovernanceRules, AIGovernanceRule, AICapability, CAPABILITY_LABELS } from '@/hooks/useAIGovernanceRules';
import AIGovernanceRuleDialog, { AIRule } from './AIGovernanceRuleDialog';
import { supabase } from '@/integrations/supabase/client';

interface AIGovernanceRulesProps {
  orgId?: string;
}

const CAPABILITY_ICONS: Record<AICapability, React.ComponentType<{ className?: string }>> = {
  image_generation: Image,
  code_generation: Code,
  document_creation: FileText,
  research_web_search: Search,
  content_summarization: FileStack,
  math_calculations: Calculator,
  creative_writing: Pencil,
  data_analysis: BarChart3,
  general_chat: MessageCircle,
};

const CAPABILITY_COLORS: Record<AICapability, string> = {
  image_generation: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  code_generation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  document_creation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  research_web_search: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  content_summarization: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  math_calculations: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  creative_writing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  data_analysis: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  general_chat: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const AIGovernanceRules: React.FC<AIGovernanceRulesProps> = ({ orgId }) => {
  const { rules, isLoading, createRule, updateRule, deleteRule, toggleRule } = useAIGovernanceRules(orgId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AIGovernanceRule | null>(null);

  const handleToggleRule = (rule: AIGovernanceRule) => {
    toggleRule.mutate({ id: rule.id, allowed: !rule.allowed });
  };

  const handleDeleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRule.mutate(id);
    }
  };

  const handleSaveRule = async (ruleData: AIRule) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (editingRule) {
      updateRule.mutate({
        id: editingRule.id,
        updates: {
          name: ruleData.name,
          capability: ruleData.capability,
          category: getCategory(ruleData.capability),
          description: ruleData.description,
          allowed: ruleData.allowed,
          applicable_roles: ruleData.roles,
        },
      });
    } else {
      createRule.mutate({
        name: ruleData.name,
        capability: ruleData.capability,
        category: getCategory(ruleData.capability),
        description: ruleData.description,
        allowed: ruleData.allowed,
        applicable_roles: ruleData.roles,
        org_id: orgId || null,
        created_by: user?.id ?? null,
      });
    }
    setEditingRule(null);
    setDialogOpen(false);
  };

  // Map capability to legacy category for backward compatibility
  const getCategory = (capability: AICapability): 'Academic' | 'Technical' | 'Creative' | 'Communication' => {
    switch (capability) {
      case 'research_web_search':
      case 'content_summarization':
      case 'math_calculations':
        return 'Academic';
      case 'code_generation':
      case 'data_analysis':
        return 'Technical';
      case 'image_generation':
      case 'creative_writing':
        return 'Creative';
      case 'document_creation':
      case 'general_chat':
      default:
        return 'Communication';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-cy="governance-tab-rules">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Usage Rules</h2>
          <p className="text-muted-foreground mt-1">Configure which AI capabilities are allowed or blocked for each role</p>
        </div>
        <Button
          data-cy="add-rule-button"
          onClick={() => {
            setEditingRule(null);
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule, index) => {
          const capability = (rule.capability || 'general_chat') as AICapability;
          const CapabilityIcon = CAPABILITY_ICONS[capability] || MessageCircle;
          
          return (
            <motion.div
              key={rule.id}
              data-cy={`rule-row-${rule.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${CAPABILITY_COLORS[capability]}`}>
                      <CapabilityIcon className="h-3 w-3" />
                      {CAPABILITY_LABELS[capability]}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.allowed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {rule.allowed ? 'Allowed' : 'Blocked'}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{rule.description || 'No description provided'}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Applies to:</span>
                    {rule.applicable_roles.map(role => (
                      <span key={role} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs capitalize">
                        {role.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-cy="toggle-switch"
                    onClick={() => handleToggleRule(rule)}
                    disabled={toggleRule.isPending}
                    className="hover:bg-muted"
                  >
                    {rule.allowed ? (
                      <ToggleRight className="h-6 w-6 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-cy="edit-rule-button"
                    onClick={() => {
                      setEditingRule(rule);
                      setDialogOpen(true);
                    }}
                    className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-cy="delete-rule-button"
                    onClick={() => handleDeleteRule(rule.id)}
                    disabled={deleteRule.isPending}
                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {rules.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No rules configured yet. Add your first rule to get started.</p>
          </div>
        )}
      </div>

      <AIGovernanceRuleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={editingRule ? {
          id: editingRule.id,
          name: editingRule.name,
          capability: (editingRule.capability || 'general_chat') as AICapability,
          description: editingRule.description || '',
          allowed: editingRule.allowed,
          roles: editingRule.applicable_roles,
        } : null}
        onSave={handleSaveRule}
      />
    </div>
  );
};

export default AIGovernanceRules;
